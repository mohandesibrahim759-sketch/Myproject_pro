// calls.js - نظام WebRTC المتكامل للمكالمات (الإصدار المعدل)
class WebRTCCallSystem {
    constructor(chatSystem) {
        this.chatSystem = chatSystem; // ربط بالنظام الرئيسي
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.dataChannel = null;
        this.isCaller = false;
        this.callId = null;
        this.roomId = null;
        this.recipientId = null;
        this.screenStream = null;
        
        // عناصر واجهة المستخدم
        this.localVideo = null;
        this.remoteVideo = null;
        this.callModal = null;
        this.callTimer = null;
        
        // إعدادات STUN/TURN
        this.iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        this.init();
    }

    async init() {
        await this.setupUIElements();
        this.setupEventListeners();
        this.setupFirebaseListeners();
    }

    async setupUIElements() {
        // استخدام العناصر الموجودة بدلاً من إنشاء جديدة
        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remoteVideo');
        this.callModal = document.getElementById('callModal');

        // إذا لم تكن العناصر موجودة، إنشاؤها
        if (!this.localVideo) {
            this.localVideo = document.createElement('video');
            this.localVideo.id = 'localVideo';
            this.localVideo.autoplay = true;
            this.localVideo.muted = true;
            this.localVideo.playsInline = true;
            this.localVideo.style.cssText = `
                position: absolute;
                top: 20px;
                left: 20px;
                width: 120px;
                height: 90px;
                background: #333;
                border-radius: 8px;
                border: 2px solid white;
                object-fit: cover;
                z-index: 1000;
            `;
        }

        if (!this.remoteVideo) {
            this.remoteVideo = document.createElement('video');
            this.remoteVideo.id = 'remoteVideo';
            this.remoteVideo.autoplay = true;
            this.remoteVideo.playsInline = true;
            this.remoteVideo.style.cssText = `
                width: 100%;
                height: 200px;
                background: #000;
                border-radius: 12px;
                margin-bottom: 20px;
                object-fit: cover;
            `;
        }
    }

    setupEventListeners() {
        // أزرار التحكم في المكالمة - بإضافة تحقق من الوجود
        setTimeout(() => {
            const muteBtn = document.getElementById('callMute');
            const videoBtn = document.getElementById('callVideo');
            const screenShareBtn = document.getElementById('callScreenShare');
            const endBtn = document.getElementById('callEnd');

            if (muteBtn) muteBtn.addEventListener('click', () => this.toggleMute());
            if (videoBtn) videoBtn.addEventListener('click', () => this.toggleVideo());
            if (screenShareBtn) screenShareBtn.addEventListener('click', () => this.toggleScreenShare());
            if (endBtn) endBtn.addEventListener('click', () => this.endCall());
        }, 1000);
    }

    setupFirebaseListeners() {
        // الاستماع للإشارات عبر Realtime Database
        if (this.chatSystem.currentUser) {
            this.setupSignalingListeners();
        }
    }

    // بدء مكالمة جديدة
    async startCall(recipientId, isVideoCall = true) {
        try {
            if (!this.chatSystem.currentUser) {
                this.showError('يجب تسجيل الدخول أولاً');
                return;
            }

            this.isCaller = true;
            this.recipientId = recipientId;
            this.roomId = this.generateRoomId();
            this.callId = this.chatSystem.generateId('call');
            
            // عرض نافذة المكالمة
            this.showCallModal(isVideoCall);
            
            // الحصول على الوسائط المحلية
            await this.getLocalStream(isVideoCall);
            
            // إنشاء اتصال Peer
            await this.createPeerConnection();
            
            // إنشاء قناة البيانات
            this.createDataChannel();
            
            // إنشاء عرض SDP
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            // حفظ بيانات المكالمة في Firebase
            await this.saveCallData({
                id: this.callId,
                roomId: this.roomId,
                callerId: this.chatSystem.currentUser.uid,
                recipientId: recipientId,
                type: isVideoCall ? 'video' : 'voice',
                offer: offer,
                status: 'calling',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // إرسال إشعار للمستلم
            await this.sendCallInvitation(recipientId);
            
            this.showInfo('جاري الاتصال...');
            
        } catch (error) {
            console.error('Error starting call:', error);
            this.showError('فشل في بدء المكالمة: ' + error.message);
        }
    }

    // الانضمام إلى مكالمة
    async joinCall(callData) {
        try {
            if (!this.chatSystem.currentUser) {
                this.showError('يجب تسجيل الدخول أولاً');
                return;
            }

            this.isCaller = false;
            this.callId = callData.id;
            this.roomId = callData.roomId;
            this.recipientId = callData.callerId;
            
            // عرض نافذة المكالمة
            this.showCallModal(callData.type === 'video');
            
            // الحصول على الوسائط المحلية
            await this.getLocalStream(callData.type === 'video');
            
            // إنشاء اتصال Peer
            await this.createPeerConnection();
            
            // تعيين عرض SDP البعيد
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(callData.offer));
            
            // إنشاء إجابة SDP
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            // إرسال الإجابة إلى المتصل
            await this.sendAnswer(callData.callerId, answer);
            
            // تحديث حالة المكالمة
            await this.updateCallStatus('active');
            
            this.showInfo('تم الانضمام إلى المكالمة');
            
        } catch (error) {
            console.error('Error joining call:', error);
            this.showError('فشل في الانضمام للمكالمة: ' + error.message);
        }
    }

    // إنشاء اتصال Peer
    async createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.iceServers);
        
        // إضافة المسارات المحلية
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
        }
        
        // معالجة المرشح ICE
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendICECandidate(event.candidate);
            }
        };
        
        // معالجة التدفق البعيد
        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            if (this.remoteVideo) {
                this.remoteVideo.srcObject = this.remoteStream;
            }
        };
        
        // معالجة تغيير حالة الاتصال
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection.connectionState);
            switch(this.peerConnection.connectionState) {
                case 'connected':
                    this.showCallConnected();
                    break;
                case 'disconnected':
                case 'failed':
                    this.handleConnectionLost();
                    break;
            }
        };
        
        // معالجة تغيير حالة ICE
        this.peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', this.peerConnection.iceConnectionState);
            if (this.peerConnection.iceConnectionState === 'failed') {
                this.handleConnectionLost();
            }
        };
    }

    // إنشاء قناة البيانات
    createDataChannel() {
        try {
            this.dataChannel = this.peerConnection.createDataChannel('chat', {
                ordered: true
            });
            
            this.dataChannel.onopen = () => {
                console.log('Data channel opened');
                this.sendTypingIndicator(false);
            };
            
            this.dataChannel.onmessage = (event) => {
                this.handleDataChannelMessage(event.data);
            };
            
            this.peerConnection.ondatachannel = (event) => {
                const channel = event.channel;
                channel.onmessage = (event) => {
                    this.handleDataChannelMessage(event.data);
                };
            };
        } catch (error) {
            console.error('Error creating data channel:', error);
        }
    }

    // الحصول على الوسائط المحلية
    async getLocalStream(isVideo = true) {
        try {
            const constraints = {
                audio: true,
                video: isVideo ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } : false
            };
            
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (this.localVideo) {
                this.localVideo.srcObject = this.localStream;
            }
            
        } catch (error) {
            console.error('Error accessing media devices:', error);
            this.showError('لا يمكن الوصول إلى الكاميرا أو الميكروفون');
            throw error;
        }
    }

    // إعداد مستمعي الإشارات
    setupSignalingListeners() {
        if (!this.chatSystem.currentUser) return;

        const userId = this.chatSystem.currentUser.uid;
        
        // الاستماع لدعوات المكالمات
        database.ref(`calls/invitations/${userId}`).on('child_added', (snapshot) => {
            const invitation = snapshot.val();
            this.handleCallInvitation(invitation);
        });
        
        // الاستماع لإجابات المكالمات
        if (this.roomId) {
            database.ref(`calls/answers/${this.roomId}`).on('value', (snapshot) => {
                const answer = snapshot.val();
                if (answer && this.isCaller) {
                    this.handleAnswer(answer);
                }
            });
        }
        
        // الاستماع للمرشحين ICE
        if (this.roomId) {
            database.ref(`calls/iceCandidates/${this.roomId}`).on('child_added', (snapshot) => {
                const candidate = snapshot.val();
                this.handleICECandidate(candidate);
            });
        }
    }

    // معالجة دعوة المكالمة
    async handleCallInvitation(invitation) {
        if (invitation && invitation.status === 'calling') {
            const acceptCall = await this.showCallInvitationModal(invitation);
            
            if (acceptCall) {
                await this.joinCall(invitation);
            } else {
                await this.rejectCall(invitation);
            }
            
            // حذف الدعوة
            database.ref(`calls/invitations/${this.chatSystem.currentUser.uid}/${invitation.id}`).remove();
        }
    }

    // عرض نافذة دعوة المكالمة
    showCallInvitationModal(invitation) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px; width: 90%;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📞</div>
                    <h3 style="margin: 0 0 10px 0; color: #333;">${invitation.callerName} يتصل بك</h3>
                    <p style="color: #666; margin-bottom: 30px;">${invitation.type === 'video' ? 'مكالمة فيديو' : 'مكالمة صوتية'}</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button id="acceptCallBtn" style="background: #25D366; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-phone"></i> قبول
                        </button>
                        <button id="rejectCallBtn" style="background: #FF3B30; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-phone-slash"></i> رفض
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.getElementById('acceptCallBtn').onclick = () => {
                document.body.removeChild(modal);
                resolve(true);
            };
            
            document.getElementById('rejectCallBtn').onclick = () => {
                document.body.removeChild(modal);
                resolve(false);
            };
        });
    }

    // رفض المكالمة
    async rejectCall(invitation) {
        try {
            await this.updateCallStatus('rejected');
            this.showInfo('تم رفض المكالمة');
            
            // إرسال رسالة رفض
            if (this.chatSystem.currentConversation) {
                await this.chatSystem.sendMessage(
                    `❌ تم رفض المكالمة`,
                    'system'
                );
            }
        } catch (error) {
            console.error('Error rejecting call:', error);
        }
    }

    // إرسال إشعار المكالمة
    async sendCallInvitation(recipientId) {
        const invitation = {
            id: this.callId,
            roomId: this.roomId,
            callerId: this.chatSystem.currentUser.uid,
            callerName: this.chatSystem.currentUser.displayName || this.chatSystem.currentUser.email.split('@')[0] || 'مستخدم',
            type: this.localStream && this.localStream.getVideoTracks().length > 0 ? 'video' : 'voice',
            timestamp: Date.now(),
            status: 'calling'
        };
        
        await database.ref(`calls/invitations/${recipientId}/${this.callId}`).set(invitation);
    }

    // إرسال إجابة المكالمة
    async sendAnswer(callerId, answer) {
        await database.ref(`calls/answers/${this.roomId}`).set({
            answer: answer,
            respondentId: this.chatSystem.currentUser.uid,
            timestamp: Date.now()
        });
    }

    // معالجة إجابة المكالمة
    async handleAnswer(answerData) {
        if (answerData.answer) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answerData.answer));
        }
    }

    // إرسال مرشح ICE
    async sendICECandidate(candidate) {
        if (!this.roomId) return;
        
        await database.ref(`calls/iceCandidates/${this.roomId}`).push({
            candidate: candidate,
            senderId: this.chatSystem.currentUser.uid,
            timestamp: Date.now()
        });
    }

    // معالجة مرشح ICE
    async handleICECandidate(candidateData) {
        if (candidateData.candidate && candidateData.senderId !== this.chatSystem.currentUser.uid) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateData.candidate));
        }
    }

    // ===== وظائف التحكم في المكالمة =====

    toggleMute() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;
                const muteBtn = document.getElementById('callMute');
                if (muteBtn) {
                    muteBtn.classList.toggle('muted', !audioTracks[0].enabled);
                    muteBtn.innerHTML = audioTracks[0].enabled ? 
                        '<i class="fas fa-microphone"></i>' : 
                        '<i class="fas fa-microphone-slash"></i>';
                }
                this.showInfo(audioTracks[0].enabled ? 'تم إلغاء كتم الصوت' : 'تم كتم الصوت');
            }
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTracks = this.localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = !videoTracks[0].enabled;
                const videoBtn = document.getElementById('callVideo');
                if (videoBtn) {
                    videoBtn.classList.toggle('disabled', !videoTracks[0].enabled);
                    videoBtn.innerHTML = videoTracks[0].enabled ? 
                        '<i class="fas fa-video"></i>' : 
                        '<i class="fas fa-video-slash"></i>';
                }
                this.showInfo(videoTracks[0].enabled ? 'تم تشغيل الكاميرا' : 'تم إيقاف الكاميرا');
            }
        }
    }

    async toggleScreenShare() {
        try {
            if (!this.screenStream) {
                this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                
                const videoTrack = this.screenStream.getVideoTracks()[0];
                const sender = this.peerConnection.getSenders().find(s => 
                    s.track && s.track.kind === 'video'
                );
                
                if (sender) {
                    await sender.replaceTrack(videoTrack);
                }
                
                videoTrack.onended = () => {
                    this.stopScreenShare();
                };
                
                const screenShareBtn = document.getElementById('callScreenShare');
                if (screenShareBtn) {
                    screenShareBtn.classList.add('active');
                }
                
                this.showInfo('تم بدء مشاركة الشاشة');
            } else {
                await this.stopScreenShare();
            }
        } catch (error) {
            console.error('Error sharing screen:', error);
            if (error.name !== 'NotAllowedError') {
                this.showError('فشل في مشاركة الشاشة');
            }
        }
    }

    async stopScreenShare() {
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
            
            if (this.localStream) {
                const videoTrack = this.localStream.getVideoTracks()[0];
                const sender = this.peerConnection.getSenders().find(s => 
                    s.track && s.track.kind === 'video'
                );
                
                if (sender && videoTrack) {
                    await sender.replaceTrack(videoTrack);
                }
            }
            
            const screenShareBtn = document.getElementById('callScreenShare');
            if (screenShareBtn) {
                screenShareBtn.classList.remove('active');
            }
            
            this.showInfo('تم إيقاف مشاركة الشاشة');
        }
    }

    async endCall() {
        // إرسال إشعار إنهاء المكالمة
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            try {
                this.dataChannel.send(JSON.stringify({
                    type: 'call_end',
                    userId: this.chatSystem.currentUser.uid
                }));
            } catch (error) {
                console.error('Error sending call end message:', error);
            }
        }
        
        // إغلاق اتصال Peer
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        // إيقاف الوسائط المحلية
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        // إيقاف مشاركة الشاشة
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
        }
        
        // تحديث حالة المكالمة
        await this.updateCallStatus('ended');
        
        // إرسال رسالة إنهاء المكالمة
        if (this.chatSystem.currentConversation) {
            const duration = this.getCallDuration();
            await this.chatSystem.sendMessage(
                `📞 ${this.isCaller ? 'مكالمة صادرة' : 'مكالمة واردة'} - ${duration}`,
                'system'
            );
        }
        
        // إخفاء نافذة المكالمة
        this.hideCallModal();
        
        // تنظيف بيانات Firebase
        this.cleanupFirebaseData();
        
        this.showInfo('تم إنهاء المكالمة');
    }

    handleConnectionLost() {
        this.showError('فقدان الاتصال. جاري إعادة المحاولة...');
        
        setTimeout(() => {
            if (this.peerConnection && 
                (this.peerConnection.connectionState === 'disconnected' || 
                 this.peerConnection.connectionState === 'failed')) {
                this.reconnectCall();
            }
        }, 3000);
    }

    async reconnectCall() {
        try {
            if (this.isCaller && this.recipientId) {
                await this.startCall(this.recipientId, this.localStream && this.localStream.getVideoTracks().length > 0);
            } else {
                this.showError('جاري انتظار إعادة اتصال المتصل...');
            }
        } catch (error) {
            console.error('Reconnection failed:', error);
            this.showError('فشل إعادة الاتصال');
            this.endCall();
        }
    }

    // ===== وظائف المساعدة =====

    showCallModal(isVideoCall) {
        if (this.callModal) {
            this.callModal.style.display = 'flex';
            
            const callContent = this.callModal.querySelector('.call-modal-content');
            if (callContent) {
                if (isVideoCall && this.remoteVideo && !callContent.querySelector('#remoteVideo')) {
                    callContent.insertBefore(this.remoteVideo, callContent.querySelector('.call-controls'));
                }
                
                if (this.localVideo && !callContent.querySelector('#localVideo')) {
                    callContent.appendChild(this.localVideo);
                }
            }
            
            const callStatus = document.getElementById('callStatus');
            if (callStatus) {
                callStatus.textContent = this.isCaller ? 'جاري الاتصال...' : 'مكالمة واردة...';
            }
        }
        
        this.startCallTimer();
    }

    hideCallModal() {
        if (this.callModal) {
            this.callModal.style.display = 'none';
        }
        
        this.stopCallTimer();
    }

    startCallTimer() {
        let seconds = 0;
        this.callTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timerEl = document.getElementById('callTimer');
            if (timerEl) {
                timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopCallTimer() {
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
    }

    getCallDuration() {
        const timerEl = document.getElementById('callTimer');
        return timerEl ? timerEl.textContent : '00:00';
    }

    showCallConnected() {
        const callStatus = document.getElementById('callStatus');
        if (callStatus) {
            callStatus.textContent = 'متصل';
        }
        this.showInfo('تم الاتصال بنجاح');
    }

    async saveCallData(callData) {
        await db.collection('calls').doc(this.callId).set(callData);
    }

    async updateCallStatus(status) {
        if (this.callId) {
            await db.collection('calls').doc(this.callId).update({
                status: status,
                ...(status === 'ended' && { 
                    endedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    duration: this.getCallDuration()
                })
            });
        }
    }

    cleanupFirebaseData() {
        if (this.roomId) {
            database.ref(`calls/answers/${this.roomId}`).remove();
            database.ref(`calls/iceCandidates/${this.roomId}`).remove();
        }
    }

    // معالجة رسائل قناة البيانات
    handleDataChannelMessage(message) {
        try {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'typing_indicator':
                    this.showTypingIndicator(data.userId, data.isTyping);
                    break;
                    
                case 'call_end':
                    this.handleRemoteCallEnd();
                    break;
                    
                case 'read_receipt':
                    this.updateReadReceipts(data.messageId);
                    break;
            }
        } catch (error) {
            console.error('Error handling data channel message:', error);
        }
    }

    showTypingIndicator(userId, isTyping) {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.style.display = isTyping ? 'block' : 'none';
        }
    }

    updateReadReceipts(messageId) {
        const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageEl) {
            const statusEl = messageEl.querySelector('.message-status');
            if (statusEl) {
                statusEl.innerHTML = '✓✓ <span style="color: var(--primary-color)">●</span>';
            }
        }
    }

    sendTypingIndicator(isTyping) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            this.dataChannel.send(JSON.stringify({
                type: 'typing_indicator',
                userId: this.chatSystem.currentUser.uid,
                isTyping: isTyping,
                timestamp: Date.now()
            }));
        }
    }

    handleRemoteCallEnd() {
        this.showInfo('انتهت المكالمة من الطرف الآخر');
        this.endCall();
    }

    generateRoomId() {
        return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    showError(message) {
        if (this.chatSystem && this.chatSystem.showToast) {
            this.chatSystem.showToast(message);
        } else {
            alert(message);
        }
        console.error(message);
    }

    showInfo(message) {
        if (this.chatSystem && this.chatSystem.showToast) {
            this.chatSystem.showToast(message);
        } else {
            console.log(message);
        }
    }
}

// جعل النظام متاحاً عالمياً
window.WebRTCCallSystem = WebRTCCallSystem;