// =============================================
// تكوين Firebase
// =============================================

const firebaseConfig = {
    apiKey: "AIzaSyBLb37cvBACSkHIzDIU7ggEcEojF5zsxKI",
    authDomain: "ibrahimmessegs.firebaseapp.com",
    projectId: "ibrahimmessegs",
    storageBucket: "ibrahimmessegs.firebasestorage.app",
    messagingSenderId: "426012859754",
    appId: "1:426012859754:web:513833a86a072c0cfd5913",
    measurementId: "G-RRKFS3KJTD"
};

// تهيئة Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const database = firebase.database();

// =============================================
// النظام الأساسي المحسن مع جميع الميزات
// =============================================

class AdvancedChatSystem {
    constructor() {
        this.currentUser = null;
        this.currentConversation = null;
        this.conversations = new Map();
        this.users = new Map();
        this.groups = new Map();
        this.tickets = new Map();
        this.achievements = new Map();
        this.integrations = new Map();
        this.analytics = new AnalyticsEngine();
        this.themeManager = new ThemeManager();
        this.collaborationTools = new CollaborationTools();
        this.gamification = new GamificationEngine();
        this.adminTools = new AdminTools();
        this.integrationManager = new IntegrationManager();
        
        // الأنظمة الجديدة
        this.enhancedMessaging = new EnhancedMessagingSystem();
        this.advancedGroups = new AdvancedGroupSystem();
        this.statusSystem = new StatusSystem();
        this.advancedMedia = new AdvancedMediaSystem();
        this.securitySystem = new AdvancedSecuritySystem();
        this.multiDeviceSystem = new MultiDeviceSystem();
        this.backupSystem = new AdvancedBackupSystem();
        
        this.isInitialized = false;
        this.messagesUnsubscribe = null;
        this.conversationsUnsubscribe = null;
        this.usersUnsubscribe = null;
    }

    // =============================================
    // النظام الأساسي المحسن
    // =============================================

    setupAdvancedEventListeners() {
        console.log('Setting up advanced event listeners');
        // سيتم ملؤها لاحقاً
    }

    initCollaborationTools() {
        console.log('Initializing collaboration tools');
        this.collaborationTools = new CollaborationTools();
        if (this.collaborationTools.initCollaborationTools) {
            this.collaborationTools.initCollaborationTools();
        }
    }

    initGamificationSystem() {
        console.log('Initializing gamification system');
        this.gamification = new GamificationEngine();
    }

    initIntegrationSystem() {
        console.log('Initializing integration system');
        this.integrationManager = new IntegrationManager();
    }

    setupAdvancedMonitoring() {
        console.log('Setting up advanced monitoring');
        // نظام المراقبة الأساسي
    }

    // تهيئة النظام المتقدم
    async initAdvancedSystem() {
        if (this.isInitialized) return;
        
        try {
            await this.loadUserPreferences();
            this.setupAdvancedEventListeners();
            this.initCollaborationTools();
            this.initGamificationSystem();
            this.initIntegrationSystem();
            this.setupAdvancedMonitoring();
            
            // تهيئة الأنظمة الجديدة
            await this.initializeEnhancedSystems();
            
            this.isInitialized = true;
            console.log('Advanced chat system initialized');
        } catch (error) {
            console.error('Error in advanced system initialization:', error);
        }
    }

    // تهيئة الأنظمة المحسنة
    async initializeEnhancedSystems() {
        try {
            // تهيئة نظام الأمان
            await this.securitySystem.initializeEncryption();
            
            // تهيئة النسخ الاحتياطي التلقائي
            this.backupSystem.setupAutoBackup();
            
            // تهيئة نظام متعدد الأجهزة
            this.multiDeviceSystem.setupRealTimeSync();
            
            // تنظيف الحالات المنتهية
            setInterval(() => {
                this.statusSystem.cleanupExpiredStatuses();
            }, 60 * 60 * 1000); // كل ساعة
            
            console.log('Enhanced systems initialized successfully');
        } catch (error) {
            console.error('Error initializing enhanced systems:', error);
        }
    }

    // نظام إدارة المحادثات المتقدم مع Firebase
    async createConversation(userId, userName) {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return null;
        }

        const conversationId = this.generateId('conversation');
        
        const conversation = {
            id: conversationId,
            participants: [this.currentUser.uid, userId],
            participantNames: {
                [this.currentUser.uid]: this.currentUser.displayName || this.currentUser.email.split('@')[0] || 'مستخدم',
                [userId]: userName || 'مستخدم'
            },
            createdBy: this.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastMessage: '',
            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
            unreadCount: 0,
            type: 'direct'
        };

        try {
            await db.collection('conversations').doc(conversationId).set(conversation);
            this.conversations.set(conversationId, conversation);
            this.updateConversationsUI();
            this.showToast(`تم إنشاء محادثة مع ${userName}`);
            return conversationId;
        } catch (error) {
            console.error('Error creating conversation:', error);
            this.showToast('خطأ في إنشاء المحادثة');
            return null;
        }
    }

    async switchConversation(conversationId) {
        if (this.currentConversation === conversationId) return;
        
        this.currentConversation = conversationId;
        
        // إلغاء الاشتراك السابق إذا كان موجوداً
        if (this.messagesUnsubscribe) {
            this.messagesUnsubscribe();
        }
        
        // تحديث واجهة المحادثة
        const conversation = this.conversations.get(conversationId);
        if (conversation) {
            const otherUserId = conversation.participants.find(id => id !== this.currentUser.uid);
            const otherUserName = conversation.participantNames[otherUserId];
            document.getElementById('currentChatName').textContent = otherUserName;
            
            // تحميل رسائل المحادثة
            this.loadMessages(conversationId);
            
            // إعادة تعيين عدد الرسائل غير المقروءة
            this.resetUnreadCount(conversationId);
        }
        
        if (conversation) {
            const otherUserId = conversation.participants.find(id => id !== this.currentUser.uid);
            this.showToast(`تم التبديل إلى محادثة ${conversation.participantNames[otherUserId]}`);
        }
    }

    async resetUnreadCount(conversationId) {
        try {
            await db.collection('conversations').doc(conversationId).update({
                unreadCount: 0
            });
        } catch (error) {
            console.error('Error resetting unread count:', error);
        }
    }

    // نظام إدارة المجموعات المتقدم مع Firebase
    async createGroup(name, description, type, settings) {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return null;
        }

        const groupId = this.generateId('group');
        const group = {
            id: groupId,
            name: name || 'مجموعة بدون اسم',
            description: description || '',
            type: type || 'public',
            settings: settings || {},
            members: {
                [this.currentUser.uid]: {
                    userId: this.currentUser.uid,
                    role: 'admin',
                    joinedAt: new Date(),
                    permissions: this.getDefaultPermissions('admin')
                }
            },
            admins: [this.currentUser.uid],
            createdBy: this.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastActivity: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('groups').doc(groupId).set(group);
            this.groups.set(groupId, group);
            this.updateGroupsUI();
            this.showToast(`تم إنشاء المجموعة "${name}" بنجاح`);
            return groupId;
        } catch (error) {
            console.error('Error creating group:', error);
            this.showToast('خطأ في إنشاء المجموعة');
            return null;
        }
    }

    // نظام التذاكر والدعم الفني مع Firebase
    async createTicket(title, description, priority = 'medium', category) {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return null;
        }

        const ticketId = this.generateId('ticket');
        const ticket = {
            id: ticketId,
            title,
            description,
            priority,
            category,
            status: 'open',
            createdBy: this.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            assignedTo: null,
            messages: []
        };

        try {
            await db.collection('tickets').doc(ticketId).set(ticket);
            this.tickets.set(ticketId, ticket);
            this.updateTicketsUI();
            this.showToast(`تم إنشاء تذكرة جديدة: ${title}`);
            return ticketId;
        } catch (error) {
            console.error('Error creating ticket:', error);
            this.showToast('خطأ في إنشاء التذكرة');
            return null;
        }
    }

    // نظام المكافآت والتحديات مع Firebase
    awardPoints(userId, points, reason) {
        if (this.gamification && typeof this.gamification.awardPoints === 'function') {
            this.gamification.awardPoints(userId, points, reason);
            this.checkAchievements(userId);
            this.updateLeaderboard();
            this.showToast(`تم منح ${points} نقطة! ${reason}`);
        } else {
            console.warn('Gamification system not available');
        }
    }

    // دالة التحقق من الإنجازات
    checkAchievements(userId) {
        console.log('Checking achievements for user:', userId);
    }

    // نظام التحليلات المتقدم مع Firebase
    trackUserEvent(event, data) {
        this.analytics.track(event, {
            userId: this.currentUser?.uid,
            timestamp: new Date(),
            ...data
        });
    }

    // نظام الرسائل مع Firebase - محسنة
    async sendMessage(text, type = 'text', additionalData = {}) {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return false;
        }

        if (!this.currentConversation) {
            this.showToast('يرجى تحديد محادثة أولاً');
            return false;
        }

        const messageId = this.generateId('msg');
        
        // إضافة الرسالة مباشرة إلى الواجهة أولاً
        const tempMessage = {
            id: messageId,
            text,
            type,
            userId: this.currentUser.uid,
            senderName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
            conversationId: this.currentConversation,
            timestamp: new Date(),
            status: 'sending',
            ...additionalData
        };
        
        // عرض الرسالة مباشرة في الواجهة
        this.addMessageToUI(tempMessage);

        try {
            // إرسال الرسالة إلى Firebase
            await db.collection('messages').doc(messageId).set({
                ...tempMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'sent'
            });
            
            // تحديث آخر رسالة في المحادثة
            await db.collection('conversations').doc(this.currentConversation).update({
                lastMessage: text,
                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                unreadCount: firebase.firestore.FieldValue.increment(1)
            });
            
            // تحديث حالة الرسالة في الواجهة
            this.updateMessageStatus(messageId, 'sent');
            
            this.trackUserEvent('message_sent', { messageId, type });
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            // تحديث حالة الرسالة إلى فشل الإرسال
            this.updateMessageStatus(messageId, 'failed');
            this.showToast('خطأ في إرسال الرسالة');
            return false;
        }
    }

    // إضافة وظيفة مساعدة جديدة لتحديث حالة الرسالة
    updateMessageStatus(messageId, status) {
        const messageEl = document.querySelector(`.message[data-id="${messageId}"]`);
        if (messageEl) {
            const statusEl = messageEl.querySelector('.message-status');
            if (statusEl) {
                if (status === 'sent') {
                    statusEl.innerHTML = '✓✓';
                    statusEl.style.color = 'var(--primary-color)';
                } else if (status === 'failed') {
                    statusEl.innerHTML = '✕';
                    statusEl.style.color = 'var(--error-color)';
                }
            }
        }
    }

    // تحميل الرسائل من Firebase - محسنة
    loadMessages(conversationId) {
        if (!this.currentUser) return;

        // إلغاء الاشتراك السابق إذا كان موجوداً
        if (this.messagesUnsubscribe) {
            this.messagesUnsubscribe();
        }

        try {
            this.messagesUnsubscribe = db.collection('messages')
                .where('conversationId', '==', conversationId)
                .onSnapshot(snapshot => {
                    const chatMessages = document.getElementById('chatMessages');
                    if (!chatMessages) return;

                    // حفظ رسالة الترحيب
                    const welcomeMessage = chatMessages.querySelector('.welcome-message');
                    
                    // مسح الرسائل الحالية فقط (مع الاحتفاظ برسالة الترحيب)
                    const existingMessages = chatMessages.querySelectorAll('.message:not(.welcome-message)');
                    existingMessages.forEach(msg => msg.remove());
                    
                    // إضافة الرسائل الجديدة
                    snapshot.forEach(doc => {
                        const messageData = doc.data();
                        this.addMessageToUI(messageData);
                    });
                    
                    // إعادة إضافة رسالة الترحيب إذا كانت موجودة
                    if (welcomeMessage && !chatMessages.contains(welcomeMessage)) {
                        chatMessages.insertBefore(welcomeMessage, chatMessages.firstChild);
                    }
                    
                    // التمرير إلى الأسفل بعد تحميل الرسائل
                    setTimeout(() => {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 100);
                }, error => {
                    console.error('Error loading messages:', error);
                    this.showToast('خطأ في تحميل الرسائل');
                });
        } catch (error) {
            console.error('Error setting up messages listener:', error);
        }
    }

    // إضافة رسالة إلى الواجهة - محسنة
    addMessageToUI(messageData) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // تجنب تكرار الرسائل
        if (document.querySelector(`.message[data-id="${messageData.id}"]`)) {
            return;
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message ${messageData.userId === this.currentUser?.uid ? 'own-message' : 'other-message'}`;
        messageEl.dataset.id = messageData.id;
        
        const isOwnMessage = messageData.userId === this.currentUser?.uid;
        const senderName = isOwnMessage ? 'أنت' : (messageData.senderName || 'مستخدم آخر');
        
        // تنسيق الوقت
        let messageTime = '--:--';
        if (messageData.timestamp) {
            try {
                let date;
                if (messageData.timestamp.toDate) {
                    date = messageData.timestamp.toDate();
                } else if (messageData.timestamp instanceof Date) {
                    date = messageData.timestamp;
                } else {
                    date = new Date(messageData.timestamp);
                }
                messageTime = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            } catch (error) {
                console.log('Error formatting time:', error);
                messageTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            }
        }

        let messageContent = '';
        
        // معالجة أنواع مختلفة من الرسائل
        switch (messageData.type) {
            case 'location':
                messageContent = `
                    <div class="message-text">
                        ${messageData.text}
                        <div style="margin-top: 8px;">
                            <a href="${messageData.locationUrl || '#'}" target="_blank" 
                            style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 5px; text-decoration: none;">
                                <i class="fas fa-map-marker-alt"></i> عرض على الخريطة
                            </a>
                        </div>
                    </div>
                `;
                break;
            case 'file':
                messageContent = `
                    <div class="message-text">
                        ${messageData.text}
                        <div style="margin-top: 8px;">
                            <button onclick="downloadFile('${messageData.fileUrl}', '${messageData.fileName}')" 
                                    style="background: var(--primary-color); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-download"></i> تحميل الملف
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 'poll':
                const optionsHtml = messageData.options ? messageData.options.map((option, index) => `
                    <div class="poll-option" onclick="voteOnPoll('${messageData.id}', ${index})" 
                        style="margin: 5px 0; padding: 8px; background: #f0f0f0; border-radius: 5px; cursor: pointer;">
                        ${option.text}
                        ${option.votes ? `<div style="margin-top: 5px; font-size: 12px; color: #666;">${option.votes} تصويت</div>` : ''}
                    </div>
                `).join('') : '';
                
                messageContent = `
                    <div class="message-text">
                        <strong>📊 ${messageData.question || 'استطلاع رأي'}</strong>
                        ${optionsHtml}
                    </div>
                `;
                break;
            default:
                messageContent = `<div class="message-text">${messageData.text}</div>`;
        }
        
        // إضافة مؤشر حالة الإرسال للرسائل الخاصة بالمستخدم
        let statusIcon = '';
        if (isOwnMessage) {
            if (messageData.status === 'sending') {
                statusIcon = '<span class="message-status" style="color: var(--typing-color)"><i class="fas fa-clock"></i></span>';
            } else if (messageData.status === 'failed') {
                statusIcon = '<span class="message-status" style="color: var(--error-color)">✕</span>';
            } else {
                statusIcon = '<span class="message-status">✓✓</span>';
            }
        }
        
        const fullMessage = `
            ${!isOwnMessage ? `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=128C7E&color=fff" alt="${senderName}">
                </div>
            ` : ''}
            
            <div class="message-content">
                ${messageContent}
                
                <div class="message-meta">
                    <span class="message-time">${messageTime}</span>
                    ${isOwnMessage ? statusIcon : ''}
                </div>
            </div>
            
            ${isOwnMessage ? `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=أنت&background=25D366&color=fff" alt="أنت">
                </div>
            ` : ''}
        `;
        
        messageEl.innerHTML = fullMessage;
        
        // إضافة الرسالة إلى الأعلى (قبل آخر رسالة)
        const existingMessages = chatMessages.querySelectorAll('.message:not(.welcome-message)');
        if (existingMessages.length > 0) {
            const lastMessage = existingMessages[existingMessages.length - 1];
            lastMessage.parentNode.insertBefore(messageEl, lastMessage.nextSibling);
        } else {
            // إذا لم تكن هناك رسائل، أضف بعد رسالة الترحيب
            const welcomeMessage = chatMessages.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.parentNode.insertBefore(messageEl, welcomeMessage.nextSibling);
            } else {
                chatMessages.appendChild(messageEl);
            }
        }
        
        // التمرير إلى الأسفل
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    // =============================================
    // الميزات المحسنة مع Firebase
    // =============================================

    // محاكاة المكالمة الصوتية
    async startVoiceCall() {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return;
        }

        const callModal = document.getElementById('callModal');
        if (callModal) {
            callModal.style.display = 'flex';
            document.getElementById('callStatus').textContent = 'مكالمة صوتية نشطة';
            
            // حفظ بيانات المكالمة في Firebase
            const callId = this.generateId('call');
            const callData = {
                id: callId,
                type: 'voice',
                participants: [this.currentUser.uid],
                startedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                initiator: this.currentUser.uid
            };

            try {
                await db.collection('calls').doc(callId).set(callData);
                
                // مؤقت المكالمة
                let seconds = 0;
                const timer = setInterval(() => {
                    seconds++;
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    document.getElementById('callTimer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }, 1000);

                // زر إنهاء المكالمة
                const callEnd = document.getElementById('callEnd');
                if (callEnd) {
                    const endCallHandler = async () => {
                        clearInterval(timer);
                        callModal.style.display = 'none';
                        
                        // تحديث حالة المكالمة في Firebase
                        await db.collection('calls').doc(callId).update({
                            status: 'ended',
                            endedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            duration: seconds
                        });

                        // إرسال رسالة عن المكالمة
                        await this.sendMessage(
                            `📞 مكالمة صوتية - ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
                            'system'
                        );

                        this.showToast('تم إنهاء المكالمة الصوتية');
                        callEnd.removeEventListener('click', endCallHandler);
                    };
                    callEnd.addEventListener('click', endCallHandler);
                }
                
                this.showToast('بدأت المكالمة الصوتية بنجاح');
            } catch (error) {
                console.error('Error starting call:', error);
                this.showToast('خطأ في بدء المكالمة');
            }
        }
    }

    // محاكاة المكالمة المرئية
    async startVideoCall() {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return;
        }

        const callModal = document.getElementById('callModal');
        if (callModal) {
            callModal.style.display = 'flex';
            document.getElementById('callStatus').textContent = 'مكالمة فيديو نشطة';
            
            // إضافة عناصر الفيديو (محاكاة)
            const callContent = document.querySelector('.call-modal-content');
            if (callContent && !document.getElementById('remoteVideo')) {
                const remoteVideo = document.createElement('div');
                remoteVideo.id = 'remoteVideo';
                remoteVideo.style.cssText = `
                    width: 100%;
                    height: 200px;
                    background: #000;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                `;
                remoteVideo.innerHTML = `
                    <div style="text-align: center;">
                        <i class="fas fa-user" style="font-size: 48px; margin-bottom: 10px;"></i>
                        <div>الدعم الفني</div>
                    </div>
                `;
                
                const localVideo = document.createElement('div');
                localVideo.id = 'localVideo';
                localVideo.style.cssText = `
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 120px;
                    height: 90px;
                    background: #333;
                    border-radius: 8px;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                `;
                localVideo.innerHTML = `<i class="fas fa-user"></i>`;
                
                callContent.insertBefore(remoteVideo, callContent.querySelector('.call-controls'));
                callContent.appendChild(localVideo);
            }

            // حفظ بيانات المكالمة في Firebase
            const callId = this.generateId('call');
            const callData = {
                id: callId,
                type: 'video',
                participants: [this.currentUser.uid],
                startedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                initiator: this.currentUser.uid
            };

            try {
                await db.collection('calls').doc(callId).set(callData);
                
                // مؤقت المكالمة
                let seconds = 0;
                const timer = setInterval(() => {
                    seconds++;
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    document.getElementById('callTimer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }, 1000);

                // زر إنهاء المكالمة
                const callEnd = document.getElementById('callEnd');
                if (callEnd) {
                    const endCallHandler = async () => {
                        clearInterval(timer);
                        callModal.style.display = 'none';
                        
                        // إزالة عناصر الفيديو
                        const remoteVideo = document.getElementById('remoteVideo');
                        const localVideo = document.getElementById('localVideo');
                        if (remoteVideo) remoteVideo.remove();
                        if (localVideo) localVideo.remove();
                        
                        // تحديث حالة المكالمة في Firebase
                        await db.collection('calls').doc(callId).update({
                            status: 'ended',
                            endedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            duration: seconds
                        });

                        // إرسال رسالة عن المكالمة
                        await this.sendMessage(
                            `📹 مكالمة فيديو - ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
                            'system'
                        );

                        this.showToast('تم إنهاء المكالمة المرئية');
                        callEnd.removeEventListener('click', endCallHandler);
                    };
                    callEnd.addEventListener('click', endCallHandler);
                }
                
                this.showToast('بدأت المكالمة المرئية بنجاح');
            } catch (error) {
                console.error('Error starting video call:', error);
                this.showToast('خطأ في بدء المكالمة المرئية');
            }
        }
    }

    // مشاركة الموقع مع Firebase
    async shareCurrentLocation() {
        if (!this.currentUser) {
            this.showToast('يجب تسجيل الدخول أولاً');
            return;
        }

        this.showToast('جاري الحصول على الموقع...');
        
        // محاكاة الحصول على الموقع
        setTimeout(async () => {
            // موقع افتراضي (مكة المكرمة)
            const latitude = 21.4225;
            const longitude = 39.8262;
            const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
            
            try {
                await this.sendMessage(
                    `📍 موقعي الحالي: مكة المكرمة\n${locationUrl}`,
                    'location',
                    {
                        latitude: latitude,
                        longitude: longitude,
                        locationUrl: locationUrl
                    }
                );
                
                this.showToast('تم مشاركة الموقع بنجاح');
                
                // استخدام نظام المكافآت بشكل آمن
                if (this.gamification && typeof this.gamification.awardPoints === 'function') {
                    this.gamification.awardPoints(this.currentUser.uid, 15, 'لمشاركة الموقع');
                }
            } catch (error) {
                console.error('Error sharing location:', error);
                this.showToast('خطأ في مشاركة الموقع');
            }
        }, 2000);
    }

    // رفع الملفات مع Firebase Storage
    async handleFileUpload(file) {
        if (!file || !this.currentUser) return;
        
        this.showToast(`جاري رفع الملف: ${file.name}`);
        
        try {
            const fileRef = storage.ref().child(`files/${this.currentUser.uid}/${Date.now()}_${file.name}`);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            const fileType = this.getFileType(file.name);
            const fileIcon = this.getFileIcon(fileType);
            
            await this.sendMessage(
                `${fileIcon} تم رفع الملف: ${file.name} (${this.formatFileSize(file.size)})`,
                'file',
                {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: fileType,
                    fileUrl: downloadURL
                }
            );
            
            this.showToast(`تم رفع الملف ${file.name} بنجاح`);
            
            // استخدام نظام المكافآت بشكل آمن
            if (this.gamification && typeof this.gamification.awardPoints === 'function') {
                this.gamification.awardPoints(this.currentUser.uid, 20, 'لرفع ملف');
            }
            
            // مسح حقل الإدخال
            document.getElementById('fileInput').value = '';
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showToast('خطأ في رفع الملف');
        }
    }

    // =============================================
    // وظائف مساعدة محسنة
    // =============================================

    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const types = {
            'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
            'mp4': 'video', 'avi': 'video', 'mov': 'video',
            'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio',
            'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document'
        };
        return types[extension] || 'file';
    }

    getFileIcon(fileType) {
        const icons = {
            'image': '🖼️',
            'video': '🎬',
                        'audio': '🎵',
            'document': '📄',
            'file': '📎'
        };
        return icons[fileType] || '📎';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getDefaultPermissions(role) {
        const permissions = {
            admin: ['manage_group', 'remove_members', 'pin_messages'],
            moderator: ['remove_messages', 'manage_topics'],
            member: ['send_messages', 'react_to_messages']
        };
        return permissions[role] || permissions.member;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    loadUserPreferences() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const theme = localStorage.getItem('chat-theme') || 'default';
                this.themeManager.setTheme(theme);
                resolve();
            }, 100);
        });
    }

    // تحديث واجهة المحادثات
    updateConversationsUI() {
        const conversationsList = document.getElementById('conversationsList');
        if (!conversationsList) return;

        conversationsList.innerHTML = '';
        this.conversations.forEach(conversation => {
            const otherUserId = conversation.participants.find(id => id !== this.currentUser.uid);
            const otherUserName = conversation.participantNames[otherUserId] || 'مستخدم';
            
            const conversationItem = document.createElement('div');
            conversationItem.className = `conversation-item ${this.currentConversation === conversation.id ? 'active' : ''}`;
            conversationItem.innerHTML = `
                <div class="conversation-avatar">
                    ${otherUserName.charAt(0)}
                </div>
                <div class="conversation-info">
                    <h4>${otherUserName}</h4>
                    <div class="conversation-last-message">${conversation.lastMessage || 'لا توجد رسائل'}</div>
                </div>
                ${conversation.unreadCount > 0 ? `<div class="unread-badge">${conversation.unreadCount}</div>` : ''}
            `;
            conversationItem.addEventListener('click', () => {
                this.switchConversation(conversation.id);
            });
            conversationsList.appendChild(conversationItem);
        });
    }

    // تحديث واجهة المجموعات
    updateGroupsUI() {
        const groupsList = document.getElementById('groupsList');
        if (!groupsList) return;

        groupsList.innerHTML = '';
        if (this.groups) {
            this.groups.forEach(group => {
                const groupItem = document.createElement('div');
                groupItem.className = 'group-item';
                groupItem.innerHTML = `
                    <div class="group-avatar">
                        ${group.name ? group.name.charAt(0) : 'G'}
                    </div>
                    <div class="group-info">
                        <h4>${group.name || 'مجموعة بدون اسم'}</h4>
                        <div class="group-members">${group.members ? Object.keys(group.members).length : 0} أعضاء</div>
                    </div>
                `;
                groupsList.appendChild(groupItem);
            });
        }
    }

    updateTicketsUI() {
        console.log('Updating tickets UI');
    }

    updateLeaderboard() {
        console.log('Updating leaderboard');
    }

    // تحميل المحادثات من Firebase - محسنة
    loadConversations() {
        if (!this.currentUser) return;

        // إلغاء الاشتراك السابق إذا كان موجوداً
        if (this.conversationsUnsubscribe) {
            this.conversationsUnsubscribe();
        }

        try {
            this.conversationsUnsubscribe = db.collection('conversations')
                .where('participants', 'array-contains', this.currentUser.uid)
                .onSnapshot(snapshot => {
                    this.conversations.clear();
                    snapshot.forEach(doc => {
                        const conversation = doc.data();
                        this.conversations.set(conversation.id, conversation);
                    });
                    this.updateConversationsUI();
                }, error => {
                    console.error('Error loading conversations:', error);
                });
        } catch (error) {
            console.error('Error setting up conversations listener:', error);
        }
    }

    // تحميل المستخدمين من Firebase - محسنة
    loadUsers() {
        if (!this.currentUser) return;

        // إلغاء الاشتراك السابق إذا كان موجوداً
        if (this.usersUnsubscribe) {
            this.usersUnsubscribe();
        }

        try {
            this.usersUnsubscribe = db.collection('users')
                .onSnapshot(snapshot => {
                    this.users.clear();
                    snapshot.forEach(doc => {
                        const user = doc.data();
                        this.users.set(user.uid, user);
                    });
                }, error => {
                    console.error('Error loading users:', error);
                });
        } catch (error) {
            console.error('Error setting up users listener:', error);
        }
    }
}

// =============================================
// الأنظمة المتخصصة المحسنة
// =============================================

// 1. نظام المراسلة المحسن
class EnhancedMessagingSystem {
    constructor() {
        this.messageStatus = {
            SENT: 'sent',
            DELIVERED: 'delivered', 
            READ: 'read',
            FAILED: 'failed'
        };
        this.typingIndicators = new Map();
        this.messageQueue = [];
        this.editTimeLimit = 15 * 60 * 1000; // 15 دقيقة
    }

    // إرسال رسالة مع تتبع الحالة
    async sendEnhancedMessage(text, conversationId, options = {}) {
        const messageId = advancedChat.generateId('msg');
        
        const messageData = {
            id: messageId,
            text: text,
            conversationId: conversationId,
            senderId: advancedChat.currentUser.uid,
            timestamp: new Date(),
            status: this.messageStatus.SENT,
            type: options.type || 'text',
            replyTo: options.replyTo,
            mentions: options.mentions || [],
            isForwarded: options.isForwarded || false,
            isEdited: false,
            editHistory: [],
            reactions: {},
            isPinned: options.isPinned || false
        };

        try {
            await db.collection('messages').doc(messageId).set({
                ...messageData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            this.updateMessageStatus(messageId, this.messageStatus.SENT);
            this.notifyRecipients(conversationId, messageData);
            
            return messageId;
        } catch (error) {
            this.updateMessageStatus(messageId, this.messageStatus.FAILED);
            throw error;
        }
    }

    // تحديث حالة الرسالة
    updateMessageStatus(messageId, status) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const statusElement = messageElement.querySelector('.message-status');
            if (statusElement) {
                let statusIcon = '';
                switch(status) {
                    case this.messageStatus.SENT:
                        statusIcon = '✓';
                        break;
                    case this.messageStatus.DELIVERED:
                        statusIcon = '✓✓';
                        break;
                    case this.messageStatus.READ:
                        statusIcon = '✓✓ <span style="color: var(--primary-color)">●</span>';
                        break;
                    case this.messageStatus.FAILED:
                        statusIcon = '✕';
                        break;
                }
                statusElement.innerHTML = statusIcon;
            }
        }
    }

    // مؤشر الكتابة
    setTypingIndicator(conversationId, userId, isTyping) {
        if (isTyping) {
            this.typingIndicators.set(`${conversationId}_${userId}`, true);
            this.showTypingIndicator(conversationId, userId);
        } else {
            this.typingIndicators.delete(`${conversationId}_${userId}`);
            this.hideTypingIndicator(conversationId, userId);
        }
    }

    // تحرير الرسالة
    async editMessage(messageId, newText) {
        const messageRef = db.collection('messages').doc(messageId);
        const messageDoc = await messageRef.get();
        
        if (messageDoc.exists) {
            const messageData = messageDoc.data();
            const messageAge = Date.now() - messageData.timestamp.toDate().getTime();
            
            if (messageAge <= this.editTimeLimit) {
                await messageRef.update({
                    text: newText,
                    isEdited: true,
                    editHistory: firebase.firestore.FieldValue.arrayUnion({
                        originalText: messageData.text,
                        editedAt: new Date()
                    })
                });
                return true;
            }
        }
        return false;
    }

    // حذف الرسالة للجميع
    async deleteMessageForEveryone(messageId) {
        await db.collection('messages').doc(messageId).update({
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: advancedChat.currentUser.uid
        });
    }

    showTypingIndicator(conversationId, userId) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        let typingEl = document.getElementById('typing-indicator');
        if (!typingEl) {
            typingEl = document.createElement('div');
            typingEl.className = 'typing-indicator';
            typingEl.id = 'typing-indicator';
            
            typingEl.innerHTML = `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=الدعم+الفني&background=128C7E&color=fff" alt="الدعم الفني">
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            chatMessages.appendChild(typingEl);
        }
    }

    hideTypingIndicator(conversationId, userId) {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    notifyRecipients(conversationId, messageData) {
        // إرسال إشعارات للمستلمين
        console.log('Notifying recipients for message:', messageData.id);
    }
}

// 2. نظام المجموعات المتقدم
class AdvancedGroupSystem {
    constructor() {
        this.maxGroupSize = 1024;
        this.groupSettings = new Map();
    }

    // إنشاء مجموعة متقدمة
    async createAdvancedGroup(groupData) {
        const groupId = advancedChat.generateId('group');
        
        const group = {
            id: groupId,
            name: groupData.name,
            description: groupData.description,
            avatar: groupData.avatar,
            createdBy: advancedChat.currentUser.uid,
            createdAt: new Date(),
            settings: {
                type: groupData.type || 'public',
                approvalRequired: groupData.approvalRequired || false,
                onlyAdminsCanPost: groupData.onlyAdminsCanPost || false,
                membersCanInvite: groupData.membersCanInvite || true
            },
            members: {
                [advancedChat.currentUser.uid]: {
                    role: 'admin',
                    joinedAt: new Date(),
                    permissions: this.getAdminPermissions()
                }
            },
            admins: [advancedChat.currentUser.uid],
            memberCount: 1,
            isActive: true
        };

        await db.collection('groups').doc(groupId).set(group);
        return groupId;
    }

    // إضافة عضو للمجموعة
    async addGroupMember(groupId, userId, invitedBy = null) {
        const groupRef = db.collection('groups').doc(groupId);
        const groupDoc = await groupRef.get();
        
        if (groupDoc.exists) {
            const group = groupDoc.data();
            
            if (group.memberCount >= this.maxGroupSize) {
                throw new Error('المجموعة ممتلئة');
            }

            await groupRef.update({
                [`members.${userId}`]: {
                    role: 'member',
                    joinedAt: new Date(),
                    invitedBy: invitedBy,
                    permissions: this.getMemberPermissions()
                },
                memberCount: firebase.firestore.FieldValue.increment(1)
            });

            this.sendGroupInvitationNotification(groupId, userId, invitedBy);
        }
    }

    // إدارة صلاحيات المجموعة
    async manageGroupPermissions(groupId, userId, newRole) {
        const allowedRoles = ['admin', 'moderator', 'member'];
        if (!allowedRoles.includes(newRole)) return false;

        const groupRef = db.collection('groups').doc(groupId);
        
        await groupRef.update({
            [`members.${userId}.role`]: newRole,
            [`members.${userId}.permissions`]: this.getPermissionsByRole(newRole)
        });

        if (newRole === 'admin') {
            await groupRef.update({
                admins: firebase.firestore.FieldValue.arrayUnion(userId)
            });
        } else {
            await groupRef.update({
                admins: firebase.firestore.FieldValue.arrayRemove(userId)
            });
        }

        return true;
    }

    // الإشارة للأعضاء
    async handleMentions(messageText, groupId) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;

        while ((match = mentionRegex.exec(messageText)) !== null) {
            const username = match[1];
            const user = await this.findUserByUsername(username);
            if (user) {
                mentions.push({
                    userId: user.uid,
                    username: username,
                    position: match.index
                });
            }
        }

        return mentions;
    }

    // إعدادات خصوصية المجموعة
    async updateGroupPrivacy(groupId, privacySettings) {
        await db.collection('groups').doc(groupId).update({
            'settings.type': privacySettings.type,
            'settings.approvalRequired': privacySettings.approvalRequired,
            'settings.onlyAdminsCanPost': privacySettings.onlyAdminsCanPost,
            'settings.membersCanInvite': privacySettings.membersCanInvite
        });
    }

    getAdminPermissions() {
        return ['manage_group', 'remove_members', 'pin_messages', 'change_settings'];
    }

    getMemberPermissions() {
        return ['send_messages', 'view_members', 'react_to_messages'];
    }

    getPermissionsByRole(role) {
        switch(role) {
            case 'admin': return this.getAdminPermissions();
            case 'moderator': return [...this.getMemberPermissions(), 'remove_messages'];
            default: return this.getMemberPermissions();
        }
    }

    async findUserByUsername(username) {
        try {
            const usersRef = db.collection('users');
            const query = await usersRef.where('username', '==', username).limit(1).get();
            
            if (!query.empty) {
                const userDoc = query.docs[0];
                return {
                    uid: userDoc.id,
                    ...userDoc.data()
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error finding user by username:', error);
            return null;
        }
    }

    async sendGroupInvitationNotification(groupId, userId, invitedBy) {
        try {
            const group = await db.collection('groups').doc(groupId).get();
            const inviter = await db.collection('users').doc(invitedBy).get();
            
            if (group.exists && inviter.exists) {
                await db.collection('notifications').add({
                    userId: userId,
                    type: 'group_invitation',
                    groupId: groupId,
                    groupName: group.data().name,
                    inviterName: inviter.data().displayName || inviter.data().email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    read: false
                });
            }
        } catch (error) {
            console.error('Error sending group invitation:', error);
        }
    }
}

// 3. نظام الحالة
class StatusSystem {
    constructor() {
        this.statusDuration = 24 * 60 * 60 * 1000; // 24 ساعة
    }

    async createStatus(statusData) {
        const statusId = advancedChat.generateId('status');
        
        const status = {
            id: statusId,
            userId: advancedChat.currentUser.uid,
            userName: advancedChat.currentUser.displayName || advancedChat.currentUser.email.split('@')[0],
            type: statusData.type,
            content: statusData.content,
            privacy: statusData.privacy || 'everyone',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            expiresAt: new Date(Date.now() + this.statusDuration),
            views: []
        };

        await db.collection('statuses').doc(statusId).set(status);
        return statusId;
    }

    async viewStatus(statusId) {
        await db.collection('statuses').doc(statusId).update({
            views: firebase.firestore.FieldValue.arrayUnion(advancedChat.currentUser.uid)
        });
    }

    cleanupExpiredStatuses() {
        const now = new Date();
        db.collection('statuses')
            .where('expiresAt', '<', now)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    doc.ref.delete();
                });
            })
            .catch(error => {
                console.error('Error cleaning up expired statuses:', error);
            });
    }
}

// 4. نظام الوسائط المتقدم
class AdvancedMediaSystem {
    constructor() {
        this.supportedFormats = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            video: ['mp4', 'webm', 'ogg'],
            audio: ['mp3', 'wav', 'ogg'],
            document: ['pdf', 'doc', 'docx', 'txt']
        };
    }

    async uploadMedia(file, type) {
        const fileRef = storage.ref().child(`media/${advancedChat.currentUser.uid}/${Date.now()}_${file.name}`);
        const snapshot = await fileRef.put(file);
        return await snapshot.ref.getDownloadURL();
    }

    compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // ضبط الحجم الأقصى
                    const maxWidth = 1024;
                    const maxHeight = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(resolve, 'image/jpeg', 0.8);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    isFormatSupported(filename, type) {
        const extension = filename.split('.').pop().toLowerCase();
        return this.supportedFormats[type]?.includes(extension) || false;
    }
}

// 5. نظام الأمان المتقدم
class AdvancedSecuritySystem {
    constructor() {
        this.encryptionKey = null;
    }

    async initializeEncryption() {
        // تهيئة تشفير من طرف العميل
        this.encryptionKey = await this.generateEncryptionKey();
    }

    async generateEncryptionKey() {
        return await crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    async encryptMessage(message) {
        if (!this.encryptionKey) return message;

        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            this.encryptionKey,
            data
        );

        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            iv: Array.from(iv)
        };
    }

    async decryptMessage(encryptedData) {
        if (!this.encryptionKey || !encryptedData.encrypted) return encryptedData;

        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(encryptedData.iv)
            },
            this.encryptionKey,
            new Uint8Array(encryptedData.encrypted)
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }
}

// 6. نظام متعدد الأجهزة
class MultiDeviceSystem {
    constructor() {
        this.deviceId = this.generateDeviceId();
        this.syncQueue = [];
    }

    generateDeviceId() {
        return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupRealTimeSync() {
        // إعداد المزامنة الفورية بين الأجهزة
        db.collection('devices')
            .doc(this.deviceId)
            .set({
                userId: advancedChat.currentUser?.uid,
                deviceId: this.deviceId,
                lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent
            });

        // الاستماع للتغييرات من الأجهزة الأخرى
        db.collection('devices')
            .where('userId', '==', advancedChat.currentUser?.uid)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.doc.id !== this.deviceId) {
                        this.handleSyncFromDevice(change.doc.data());
                    }
                });
            });
    }

    handleSyncFromDevice(deviceData) {
        // معالجة المزامنة من جهاز آخر
        console.log('Syncing from device:', deviceData.deviceId);
    }

    async syncToDevices(data) {
        // مزامنة البيانات إلى جميع الأجهزة
        const devices = await db.collection('devices')
            .where('userId', '==', advancedChat.currentUser?.uid)
            .get();

        devices.forEach(device => {
            if (device.id !== this.deviceId) {
                // إرسال البيانات إلى الجهاز الآخر
                this.sendSyncData(device.id, data);
            }
        });
    }

    sendSyncData(deviceId, data) {
        // إرسال بيانات المزامنة عبر WebSocket أو FCM
        console.log('Sending sync data to device:', deviceId, data);
    }
}

// 7. نظام النسخ الاحتياطي المتقدم
class AdvancedBackupSystem {
    constructor() {
        this.backupInterval = 24 * 60 * 60 * 1000; // 24 ساعة
    }

    setupAutoBackup() {
        setInterval(() => {
            this.createAutoBackup();
        }, this.backupInterval);
    }

    async createAutoBackup() {
        if (!advancedChat.currentUser) return;

        const backupData = await this.collectUserData();
        const backupId = await this.saveBackup(backupData, 'auto');

        // تنظيف النسخ القديمة
        this.cleanupOldBackups();

        return backupId;
    }

    async collectUserData() {
        const userId = advancedChat.currentUser.uid;
        const data = {
            userId: userId,
            timestamp: new Date(),
            conversations: [],
            messages: [],
            groups: [],
            settings: {}
        };

        // جمع المحادثات
        const conversations = await db.collection('conversations')
            .where('participants', 'array-contains', userId)
            .get();
        
        conversations.forEach(doc => {
            data.conversations.push(doc.data());
        });

        // جمع الرسائل
        const messages = await db.collection('messages')
            .where('senderId', '==', userId)
            .get();
        
        messages.forEach(doc => {
            data.messages.push(doc.data());
        });

        // جمع المجموعات
        const groups = await db.collection('groups')
            .where(`members.${userId}`, '!=', null)
            .get();
        
        groups.forEach(doc => {
            data.groups.push(doc.data());
        });

        return data;
    }

    async saveBackup(data, type) {
        const backupRef = storage.ref().child(`backups/${advancedChat.currentUser.uid}/${Date.now()}_backup.json`);
        await backupRef.put(JSON.stringify(data), {
            contentType: 'application/json'
        });

        const backupId = advancedChat.generateId('backup');
        await db.collection('backups').doc(backupId).set({
            id: backupId,
            userId: advancedChat.currentUser.uid,
            type: type,
            size: JSON.stringify(data).length,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            downloadUrl: await backupRef.getDownloadURL()
        });

        return backupId;
    }

    async cleanupOldBackups() {
        const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 يوم
        
        const oldBackups = await db.collection('backups')
            .where('userId', '==', advancedChat.currentUser.uid)
            .where('createdAt', '<', cutoffDate)
            .get();

        oldBackups.forEach(async (backup) => {
            // حذف من Storage
            const backupRef = storage.refFromURL(backup.data().downloadUrl);
            await backupRef.delete();
            
            // حذف من Firestore
            await backup.ref.delete();
        });
    }
}

// 8. أنظمة مساعدة
class AnalyticsEngine {
    constructor() {
        this.events = [];
    }

    track(event, data) {
        this.events.push({
            event: event,
            data: data,
            timestamp: new Date()
        });

        // إرسال إلى Firebase Analytics
        this.sendToAnalytics(event, data);
    }

    sendToAnalytics(event, data) {
        // إرسال البيانات التحليلية
        console.log('Analytics event:', event, data);
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
    }

    setTheme(theme) {
        document.body.className = theme;
        this.currentTheme = theme;
        localStorage.setItem('chat-theme', theme);
    }

    getTheme() {
        return this.currentTheme;
    }
}

class CollaborationTools {
    constructor() {
        this.tools = ['whiteboard', 'screen-share', 'document-collaboration'];
    }

    initCollaborationTools() {
        console.log('Initializing collaboration tools');
    }
}

class GamificationEngine {
    constructor() {
        this.points = new Map();
        this.achievements = new Map();
    }

    awardPoints(userId, points, reason) {
        const currentPoints = this.points.get(userId) || 0;
        this.points.set(userId, currentPoints + points);
        
        console.log(`Awarded ${points} points to user ${userId}: ${reason}`);
    }

    checkAchievements(userId) {
        console.log('Checking achievements for user:', userId);
    }
}

class AdminTools {
    constructor() {
        this.permissions = new Map();
    }

    hasPermission(userId, permission) {
        const userPermissions = this.permissions.get(userId) || [];
        return userPermissions.includes(permission);
    }

    grantPermission(userId, permission) {
        const userPermissions = this.permissions.get(userId) || [];
        userPermissions.push(permission);
        this.permissions.set(userId, userPermissions);
    }
}

class IntegrationManager {
    constructor() {
        this.integrations = new Map();
    }

    addIntegration(platform, config) {
        this.integrations.set(platform, config);
    }

    getIntegration(platform) {
        return this.integrations.get(platform);
    }
}

// =============================================
// تهيئة النظام عند تحميل الصفحة
// =============================================

document.addEventListener('DOMContentLoaded', async function() {
    // تهيئة النظام
    window.advancedChat = new AdvancedChatSystem();
    
    // التحقق من حالة المصادقة
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            advancedChat.currentUser = user;
            await advancedChat.initAdvancedSystem();
            advancedChat.loadConversations();
            advancedChat.loadUsers();
            
            // إخفاء زر تسجيل الدخول وإظهار اسم المستخدم
            document.getElementById('authBtn').innerHTML = `
                <i class="fas fa-user"></i> ${user.displayName || user.email.split('@')[0]}
            `;
            
            // تحديث حالة الاتصال
            const connectionStatus = document.getElementById('connectionStatus');
            connectionStatus.textContent = 'متصل';
            connectionStatus.className = 'connection-status connected';
        } else {
            // إظهار نافذة تسجيل الدخول
            document.getElementById('authModal').style.display = 'flex';
        }
    });
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
});

// دالة إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر تسجيل الدخول
    document.getElementById('authBtn').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'flex';
    });
    
    // إغلاق نافذة المصادقة
    document.getElementById('authModalClose').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });
    
    // تبويبات المصادقة
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('authSubmitBtn').textContent = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب';
            document.getElementById('authNameGroup').style.display = isLogin ? 'none' : 'flex';
        });
    });
    
    // نموذج المصادقة
    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const isLogin = document.querySelector('.auth-tab.active').dataset.tab === 'login';
        const authError = document.getElementById('authError');
        
        try {
            if (isLogin) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                const name = document.getElementById('authName').value;
                const result = await auth.createUserWithEmailAndPassword(email, password);
                
                // تحديث ملف المستخدم
                await result.user.updateProfile({
                    displayName: name
                });
                
                // إنشاء مستند المستخدم في Firestore
                await db.collection('users').doc(result.user.uid).set({
                    uid: result.user.uid,
                    email: email,
                    displayName: name,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                    isOnline: true,
                    status: 'متصل'
                });
            }
            
            document.getElementById('authModal').style.display = 'none';
            authError.textContent = '';
        } catch (error) {
            authError.textContent = error.message;
        }
    });
    
    // زر الإعدادات
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'flex';
    });
    
    // زر القائمة الرئيسية
    document.getElementById('fabMain').addEventListener('click', () => {
        const quickActions = document.getElementById('quickActions');
        quickActions.style.display = quickActions.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // أزرار الإجراءات السريعة
    document.getElementById('quickGroup').addEventListener('click', () => {
        document.getElementById('createGroupModal').style.display = 'flex';
        document.getElementById('quickActions').style.display = 'none';
    });
    
    document.getElementById('quickPoll').addEventListener('click', () => {
        document.getElementById('createPollModal').style.display = 'flex';
        document.getElementById('quickActions').style.display = 'none';
    });
    
    document.getElementById('quickWhiteboard').addEventListener('click', () => {
        document.getElementById('whiteboardContainer').style.display = 'block';
        document.getElementById('quickActions').style.display = 'none';
        initWhiteboard();
    });
    
    document.getElementById('quickSchedule').addEventListener('click', () => {
        document.getElementById('scheduleModal').style.display = 'flex';
        document.getElementById('quickActions').style.display = 'none';
    });
    
    document.getElementById('quickTheme').addEventListener('click', () => {
        const currentTheme = document.body.className;
        const themes = ['', 'theme-dark', 'theme-blue', 'theme-purple'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        document.body.className = themes[nextIndex];
        
        localStorage.setItem('chat-theme', themes[nextIndex]);
        document.getElementById('quickActions').style.display = 'none';
    });
    
    document.getElementById('quickDashboard').addEventListener('click', () => {
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('quickActions').style.display = 'none';
        loadDashboardData();
    });
    
    document.getElementById('quickStatus').addEventListener('click', () => {
        document.getElementById('statusModal').style.display = 'flex';
        document.getElementById('quickActions').style.display = 'none';
        loadStatuses();
    });
    
    document.getElementById('quickBackup').addEventListener('click', () => {
        createBackup();
        document.getElementById('quickActions').style.display = 'none';
    });
    
    // زر المحادثات
    document.getElementById('conversationsToggle').addEventListener('click', () => {
        const sidebar = document.getElementById('conversationsSidebar');
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });
    
    document.getElementById('closeConversations').addEventListener('click', () => {
        document.getElementById('conversationsSidebar').style.display = 'none';
    });
    
    document.getElementById('createConversationBtn').addEventListener('click', () => {
        document.getElementById('newConversationModal').style.display = 'flex';
        loadUsersList();
    });
    
    // زر البحث
    document.getElementById('chatSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const clearBtn = document.getElementById('clearSearch');
        
        if (searchTerm) {
            clearBtn.style.display = 'flex';
            searchMessages(searchTerm);
        } else {
            clearBtn.style.display = 'none';
            clearSearch();
        }
    });
    
    document.getElementById('clearSearch').addEventListener('click', () => {
        document.getElementById('chatSearch').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        clearSearch();
    });
    
    // أزرار الإدخال
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    document.getElementById('chatSend').addEventListener('click', sendMessage);
    
    // زر الإيموجي
    document.getElementById('chatEmojiBtn').addEventListener('click', () => {
        const emojiModal = document.getElementById('emojiModal');
        emojiModal.style.display = emojiModal.style.display === 'flex' ? 'none' : 'flex';
        if (emojiModal.style.display === 'flex') {
            loadEmojis();
        }
    });
    
    document.getElementById('emojiModalClose').addEventListener('click', () => {
        document.getElementById('emojiModal').style.display = 'none';
    });
    
    // زر مشاركة الموقع
    document.getElementById('shareLocationBtn').addEventListener('click', () => {
        advancedChat.shareCurrentLocation();
    });
    
    // زر رفع الملفات
    document.getElementById('chatAttachmentBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            advancedChat.handleFileUpload(file);
        }
    });
    
    // زر التسجيل الصوتي
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];
    
    document.getElementById('voiceRecordBtn').addEventListener('mousedown', startRecording);
    document.getElementById('voiceRecordBtn').addEventListener('mouseup', stopRecording);
    document.getElementById('voiceRecordBtn').addEventListener('mouseleave', stopRecording);
    
    // للهواتف
    document.getElementById('voiceRecordBtn').addEventListener('touchstart', startRecording);
    document.getElementById('voiceRecordBtn').addEventListener('touchend', stopRecording);
    
    function startRecording() {
        if (isRecording) return;
        
        isRecording = true;
        document.getElementById('voiceRecordBtn').style.color = 'red';
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });
                
                // إظهار مؤشر التسجيل
                const voiceRecorder = document.getElementById('voiceRecorder');
                voiceRecorder.style.display = 'flex';
                
                // بدء مؤقت التسجيل
                let seconds = 0;
                const timerInterval = setInterval(() => {
                    seconds++;
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    voiceRecorder.querySelector('.voice-timer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }, 1000);
                
                // حفظ معرف المؤقت لاستخدامه لاحقًا
                voiceRecorder.dataset.timerId = timerInterval;
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                isRecording = false;
                document.getElementById('voiceRecordBtn').style.color = '';
            });
    }
    
    function stopRecording() {
        if (!isRecording) return;
        
        isRecording = false;
        document.getElementById('voiceRecordBtn').style.color = '';
        
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            
            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // إرسال الرسالة الصوتية
                advancedChat.sendMessage(
                    '🎙️ رسالة صوتية',
                    'audio',
                    {
                        audioUrl: audioUrl,
                        audioBlob: audioBlob
                    }
                );
                
                // إعادة تعيين المتغيرات
                audioChunks = [];
                
                // إخفاء مؤشر التسجيل
                const voiceRecorder = document.getElementById('voiceRecorder');
                voiceRecorder.style.display = 'none';
                
                // إيقاف المؤقت
                clearInterval(voiceRecorder.dataset.timerId);
            });
        }
    }
    
    // أزرار المكالمات
    document.getElementById('chatVideoCall').addEventListener('click', () => {
        advancedChat.startVideoCall();
    });
    
    document.getElementById('chatVoiceCall').addEventListener('click', () => {
        advancedChat.startVoiceCall();
    });
    
    // زر القائمة
    document.getElementById('chatMenuBtn').addEventListener('click', () => {
        const menuModal = document.getElementById('menuModal');
        menuModal.style.display = menuModal.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // عناصر القائمة
    document.getElementById('menuProfile').addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'flex';
        document.getElementById('menuModal').style.display = 'none';
        loadProfileData();
    });
    
    document.getElementById('menuSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'flex';
        document.getElementById('menuModal').style.display = 'none';
    });
    
    document.getElementById('menuPrivacy').addEventListener('click', () => {
        document.getElementById('privacyModal').style.display = 'flex';
        document.getElementById('menuModal').style.display = 'none';
    });
    
    document.getElementById('menuBackup').addEventListener('click', () => {
        createBackup();
        document.getElementById('menuModal').style.display = 'none';
    });
    
    document.getElementById('menuLogout').addEventListener('click', () => {
        auth.signOut();
        document.getElementById('menuModal').style.display = 'none';
    });
    
    // أزرار نافذة الحالة
    document.getElementById('closeStatus').addEventListener('click', () => {
        document.getElementById('statusModal').style.display = 'none';
    });
    
    document.getElementById('addStatusBtn').addEventListener('click', () => {
        document.getElementById('createStatusModal').style.display = 'flex';
    });
    
    document.getElementById('closeCreateStatus').addEventListener('click', () => {
        document.getElementById('createStatusModal').style.display = 'none';
    });
    
    // خيارات إنشاء الحالة
    document.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            if (type === 'text') {
                // فتح محرر النص
                document.getElementById('textStatusModal').style.display = 'flex';
            } else if (type === 'image') {
                // فتح منتقي الصور
                document.getElementById('imageStatusInput').click();
            } else if (type === 'video') {
                // فتح منتقي الفيديو
                document.getElementById('videoStatusInput').click();
            }
            
            document.getElementById('createStatusModal').style.display = 'none';
        });
    });
    
    // أزرار نافذة الخصوصية
    document.getElementById('closePrivacy').addEventListener('click', () => {
        document.getElementById('privacyModal').style.display = 'none';
    });
    
    document.getElementById('savePrivacySettings').addEventListener('click', () => {
        const lastSeen = document.getElementById('lastSeenPrivacy').value;
        const profilePicture = document.getElementById('profilePicturePrivacy').value;
        const status = document.getElementById('statusPrivacySetting').value;
        const readReceipts = document.getElementById('readReceipts').checked;
        
        // حفظ الإعدادات في Firestore
        db.collection('users').doc(advancedChat.currentUser.uid).update({
            privacy: {
                lastSeen: lastSeen,
                profilePicture: profilePicture,
                status: status,
                readReceipts: readReceipts
            }
        }).then(() => {
            advancedChat.showToast('تم حفظ إعدادات الخصوصية');
            document.getElementById('privacyModal').style.display = 'none';
        }).catch(error => {
            console.error('Error saving privacy settings:', error);
            advancedChat.showToast('خطأ في حفظ الإعدادات');
        });
    });
    
    // أزرار نافذة المكالمة
    document.getElementById('callEnd').addEventListener('click', () => {
        document.getElementById('callModal').style.display = 'none';
    });
    
    document.getElementById('callMute').addEventListener('click', function() {
        this.classList.toggle('muted');
        // تبديل كتم الصوت
    });
    
    document.getElementById('callVideo').addEventListener('click', function() {
        this.classList.toggle('disabled');
        // تبديل إيقاف الفيديو
    });
    
    document.getElementById('callScreenShare').addEventListener('click', function() {
        this.classList.toggle('active');
        // تبديل مشاركة الشاشة
    });
    
    // أزرار لوحة التحكم
    document.getElementById('closeDashboard').addEventListener('click', () => {
        document.getElementById('adminDashboard').style.display = 'none';
    });
    
    // أزرار التكامل
    document.getElementById('connectSlack').addEventListener('click', () => {
        connectToIntegration('slack');
    });
    
    document.getElementById('connectDiscord').addEventListener('click', () => {
        connectToIntegration('discord');
    });
    
    // أزرار النسخ الاحتياطي
    document.getElementById('createBackupBtn').addEventListener('click', () => {
        createBackup();
    });
    
    document.getElementById('restoreBackupBtn').addEventListener('click', () => {
        document.getElementById('restoreBackupModal').style.display = 'flex';
        loadBackupsList();
    });
    
    document.getElementById('manageBackupsBtn').addEventListener('click', () => {
        document.getElementById('manageBackupsModal').style.display = 'flex';
        loadBackupsList();
    });
    
    // أزرار السبورة
    document.getElementById('closeWhiteboard').addEventListener('click', () => {
        document.getElementById('whiteboardContainer').style.display = 'none';
    });
    
    document.querySelectorAll('.whiteboard-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            document.querySelectorAll('.whiteboard-tool').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (this.id === 'clearWhiteboard') {
                clearWhiteboard();
            } else if (this.id === 'saveWhiteboard') {
                saveWhiteboard();
            }
        });
    });
    
    // أزرار التسجيل الصوتي
    document.getElementById('voiceSend').addEventListener('click', () => {
        // إرسال التسجيل الصوتي
        stopRecording();
    });
    
    document.getElementById('voiceCancel').addEventListener('click', () => {
        // إلغاء التسجيل الصوتي
        stopRecording();
    });
    
    // أزرار الإعدادات
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
        });
    });
    
    // أزرار الملف الشخصي
    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'none';
    });
    
    // أزرار إنشاء المجموعة
    document.getElementById('closeCreateGroup').addEventListener('click', () => {
        document.getElementById('createGroupModal').style.display = 'none';
    });
    
    document.getElementById('cancelCreateGroup').addEventListener('click', () => {
        document.getElementById('createGroupModal').style.display = 'none';
    });
    
    document.querySelector('.create-group-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('groupName').value;
        const description = document.getElementById('groupDescription').value;
        const type = document.getElementById('groupType').value;
        
        await advancedChat.createGroup(name, description, type);
        document.getElementById('createGroupModal').style.display = 'none';
    });
    
    // أزرار إنشاء استطلاع رأي
    document.getElementById('closeCreatePoll').addEventListener('click', () => {
        document.getElementById('createPollModal').style.display = 'none';
    });
    
    document.getElementById('cancelCreatePoll').addEventListener('click', () => {
        document.getElementById('createPollModal').style.display = 'none';
    });
    
    document.getElementById('addPollOption').addEventListener('click', () => {
        const pollOptions = document.getElementById('pollOptions');
        const optionCount = pollOptions.children.length;
        
        if (optionCount < 10) {
            const newOption = document.createElement('div');
            newOption.className = 'poll-option-input';
            newOption.innerHTML = `
                <input type="text" placeholder="الخيار ${optionCount + 1}" required>
                <button type="button" class="remove-option">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            pollOptions.appendChild(newOption);
            
            // إضافة مستمع للأحداث لزر الحذف
            newOption.querySelector('.remove-option').addEventListener('click', function() {
                newOption.remove();
            });
        }
    });
    
    document.querySelector('.create-poll-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const question = document.getElementById('pollQuestion').value;
        const options = Array.from(document.querySelectorAll('#pollOptions input'))
            .map(input => ({ text: input.value, votes: 0 }))
            .filter(option => option.text.trim());
        
        if (options.length >= 2) {
            await advancedChat.sendMessage(
                '',
                'poll',
                {
                    question: question,
                    options: options
                }
            );
            
            document.getElementById('createPollModal').style.display = 'none';
        }
    });
    
    // أزرار جدولة الاجتماع
    document.getElementById('closeSchedule').addEventListener('click', () => {
        document.getElementById('scheduleModal').style.display = 'none';
    });
    
    document.getElementById('cancelSchedule').addEventListener('click', () => {
        document.getElementById('scheduleModal').style.display = 'none';
    });
    
    document.querySelector('.schedule-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('meetingTitle').value;
        const description = document.getElementById('meetingDescription').value;
        const date = document.getElementById('meetingDate').value;
        const time = document.getElementById('meetingTime').value;
        
        const meetingData = {
            title: title,
            description: description,
            date: date,
            time: time,
            participants: []
        };
        
        // إنشاء الاجتماع في Firestore
        await db.collection('meetings').add({
            ...meetingData,
            createdBy: advancedChat.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // إرسال رسالة عن الاجتماع
        await advancedChat.sendMessage(
            `📅 اجتماع مجدول: ${title}\n📅 ${date} - ${time}`,
            'meeting',
            meetingData
        );
        
        document.getElementById('scheduleModal').style.display = 'none';
        advancedChat.showToast('تم جدولة الاجتماع بنجاح');
    });
    
    // أزرار إنشاء محادثة جديدة
    document.getElementById('closeNewConversation').addEventListener('click', () => {
        document.getElementById('newConversationModal').style.display = 'none';
    });
    
    document.getElementById('searchUsersInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterUsersList(searchTerm);
    });
    
    // أزرار استعادة النسخ الاحتياطي
    document.getElementById('closeRestoreBackup').addEventListener('click', () => {
        document.getElementById('restoreBackupModal').style.display = 'none';
    });
    
    // مستمعو الأحداث العامة
    document.addEventListener('click', (e) => {
        // إغلاق النوافذ المنبثقة عند النقر خارجها
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // مستمعو أحداث لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        // إغلاق النوافذ المنبثقة بضغط ESC
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal, .status-modal, .create-status-modal, .call-modal, .privacy-modal, .settings-modal, .profile-modal, .create-group-modal, .create-poll-modal, .schedule-modal, .new-conversation-modal, .restore-backup-modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// دوال مساعدة
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (text) {
        advancedChat.sendMessage(text);
        input.value = '';
        input.style.height = 'auto';
    }
}

function searchMessages(searchTerm) {
    const messages = document.querySelectorAll('.message');
    
    messages.forEach(message => {
        const messageText = message.querySelector('.message-text').textContent.toLowerCase();
        
        if (messageText.includes(searchTerm)) {
            message.classList.add('message-highlight');
        } else {
            message.classList.remove('message-highlight');
        }
    });
}

function clearSearch() {
    document.querySelectorAll('.message-highlight').forEach(message => {
        message.classList.remove('message-highlight');
    });
}

function loadEmojis() {
    const categories = document.getElementById('emojiCategories');
    const grid = document.getElementById('emojiGrid');
    
    // تنظيف المحتوى الحالي
    categories.innerHTML = '';
    grid.innerHTML = '';
    
    // بيانات الإيموجي
    const emojiData = {
        '': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋'],
        '': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍'],
        '': ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👩‍🦰', '👱‍♀️', '👱', '👩‍🦳', '👨‍🦳', '🧔‍♀️', '🧔', '👱‍♀️', '👱', '👩‍🦱', '👨‍🦱', '👩‍🦰'],
        '': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒'],
        '': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬'],
        '': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳'],
        '': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍', '🛵', '🚲', '🛴', '🛹', '🛼'],
        '': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️']
    };
    
    // إنشاء فئات الإيموجي
    Object.keys(emojiData).forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'emoji-category';
        categoryBtn.textContent = category;
        categoryBtn.addEventListener('click', () => {
            document.querySelectorAll('.emoji-category').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
            
            // عرض إيموجي الفئة المحددة
            grid.innerHTML = '';
            emojiData[category].forEach(emoji => {
                const emojiItem = document.createElement('button');
                emojiItem.className = 'emoji-item';
                emojiItem.textContent = emoji;
                emojiItem.addEventListener('click', () => {
                    const input = document.getElementById('chatInput');
                    input.value += emoji;
                    document.getElementById('emojiModal').style.display = 'none';
                    input.focus();
                });
                grid.appendChild(emojiItem);
            });
        });
        
        categories.appendChild(categoryBtn);
    });
    
    // تحديد الفئة الأولى وعرضها
    document.querySelector('.emoji-category').click();
}

function loadStatuses() {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';
    
    // تحميل الحالات من Firestore
    db.collection('statuses')
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const status = doc.data();
                
                const statusItem = document.createElement('div');
                statusItem.className = 'status-item';
                
                // حساب الوقت المنقضي
                let timeText = '';
                if (status.timestamp) {
                    const now = new Date();
                    const statusTime = status.timestamp.toDate();
                    const diffMs = now - statusTime;
                    const diffMins = Math.floor(diffMs / 60000);
                    
                    if (diffMins < 60) {
                        timeText = `منذ ${diffMins} دقيقة`;
                    } else {
                        const diffHours = Math.floor(diffMins / 60);
                        if (diffHours < 24) {
                            timeText = `منذ ${diffHours} ساعة`;
                        } else {
                            const diffDays = Math.floor(diffHours / 24);
                            timeText = `منذ ${diffDays} يوم`;
                        }
                    }
                }
                
                statusItem.innerHTML = `
                    <div class="status-avatar">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(status.userName)}&background=128C7E&color=fff" alt="${status.userName}">
                    </div>
                    <div class="status-info">
                        <h4>${status.userName}</h4>
                        <p>${status.type === 'text' ? status.text : status.type === 'image' ? 'صورة' : 'فيديو'}</p>
                        <div class="status-time">${timeText}</div>
                    </div>
                `;
                
                statusItem.addEventListener('click', () => {
                    viewStatus(doc.id);
                });
                
                statusList.appendChild(statusItem);
            });
        })
        .catch(error => {
            console.error('Error loading statuses:', error);
        });
}

function viewStatus(statusId) {
    // عرض الحالة المحددة
    db.collection('statuses').doc(statusId).get()
        .then(doc => {
            if (doc.exists) {
                const status = doc.data();
                
                const statusViewModal = document.createElement('div');
                statusViewModal.className = 'status-view-modal';
                statusViewModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 4000;
                `;
                
                let statusContent = '';
                if (status.type === 'text') {
                    statusContent = `
                        <div style="background: white; padding: 20px; border-radius: 12px; max-width: 80%; text-align: center;">
                            <h3>${status.userName}</h3>
                            <p>${status.text}</p>
                        </div>
                    `;
                } else if (status.type === 'image') {
                    statusContent = `
                        <img src="${status.imageUrl}" style="max-width: 80%; max-height: 80%; border-radius: 12px;">
                    `;
                } else if (status.type === 'video') {
                    statusContent = `
                        <video controls style="max-width: 80%; max-height: 80%; border-radius: 12px;">
                            <source src="${status.videoUrl}" type="video/mp4">
                        </video>
                    `;
                }
                
                statusViewModal.innerHTML = `
                    <div style="position: absolute; top: 20px; right: 20px;">
                        <button id="closeStatusView" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ${statusContent}
                `;
                
                document.body.appendChild(statusViewModal);
                
                // إغلاق نافذة عرض الحالة
                document.getElementById('closeStatusView').addEventListener('click', () => {
                    document.body.removeChild(statusViewModal);
                });
                
                // التمرير التلقائي للحالات التالية
                let currentStatusIndex = 0;
                const statuses = Array.from(document.querySelectorAll('.status-item'));
                const currentIndex = statuses.findIndex(item => item.onclick.toString().includes(statusId));
                
                if (currentIndex !== -1) {
                    currentStatusIndex = currentIndex;
                }
                
                let statusTimer = setTimeout(() => {
                    document.body.removeChild(statusViewModal);
                    
                    // عرض الحالة التالية
                    if (currentStatusIndex < statuses.length - 1) {
                        statuses[currentStatusIndex + 1].click();
                    }
                }, 5000); // 5 ثواني لكل حالة
                
                // إلغاء المؤقت عند النقر
                statusViewModal.addEventListener('click', () => {
                    clearTimeout(statusTimer);
                });
            }
        })
        .catch(error => {
            console.error('Error viewing status:', error);
        });
}

function loadDashboardData() {
    // تحميل إحصائيات المستخدمين
    db.collection('users').get()
        .then(snapshot => {
            document.getElementById('totalUsers').textContent = snapshot.size;
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
    
    // تحميل إحصائيات الرسائل
    db.collection('messages').get()
        .then(snapshot => {
            document.getElementById('totalMessages').textContent = snapshot.size;
        })
        .catch(error => {
            console.error('Error loading messages:', error);
        });
    
    // تحميل إحصائيات المحادثات النشطة
    db.collection('conversations').where('lastMessageTime', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)).get()
        .then(snapshot => {
            document.getElementById('activeConversations').textContent = snapshot.size;
        })
        .catch(error => {
            console.error('Error loading active conversations:', error);
        });
    
    // تحميل إحصائيات المستخدمين المتصلين
    db.collection('users').where('isOnline', '==', true).get()
        .then(snapshot => {
            document.getElementById('onlineUsers').textContent = snapshot.size;
        })
        .catch(error => {
            console.error('Error loading online users:', error);
        });
    
    // تحميل بيانات الرسم البياني
    loadAnalyticsChart();
}

function loadAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    // تحميل بيانات الرسم البياني من Firestore
        // تحميل بيانات الرسم البياني من Firestore
    db.collection('analytics')
        .orderBy('date', 'desc')
        .limit(7)
        .get()
        .then(snapshot => {
            const data = [];
            const labels = [];
            
            snapshot.forEach(doc => {
                const analytics = doc.data();
                data.push(analytics.messageCount);
                labels.push(analytics.date.toDate().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }));
            });
            
            // عكس المصفوفات لعرض البيانات من الأقدم إلى الأحدث
            data.reverse();
            labels.reverse();
            
            // إنشاء الرسم البياني
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'عدد الرسائل',
                        data: data,
                        backgroundColor: 'rgba(18, 140, 126, 0.2)',
                        borderColor: 'rgba(18, 140, 126, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading analytics data:', error);
        });
}

function connectToIntegration(platform) {
    // هنا يتم تنفيذ عملية الاتصال بالمنصة المحددة
    advancedChat.showToast(`جاري الاتصال بـ ${platform}...`);
    
    // محاكاة عملية الاتصال
    setTimeout(() => {
        // حفظ معلومات التكامل في Firestore
        db.collection('integrations').add({
            platform: platform,
            userId: advancedChat.currentUser.uid,
            connectedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        }).then(() => {
            advancedChat.showToast(`تم الاتصال بـ ${platform} بنجاح`);
        }).catch(error => {
            console.error(`Error connecting to ${platform}:`, error);
            advancedChat.showToast(`خطأ في الاتصال بـ ${platform}`);
        });
    }, 2000);
}

function createBackup() {
    const backupStatus = document.getElementById('backupStatus');
    backupStatus.textContent = 'جاري إنشاء النسخة الاحتياطية...';
    
    // محاكاة عملية إنشاء النسخة الاحتياطية
    setTimeout(() => {
        // حفظ معلومات النسخة الاحتياطية في Firestore
        db.collection('backups').add({
            createdBy: advancedChat.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'manual',
            status: 'completed'
        }).then(() => {
            backupStatus.textContent = 'تم إنشاء النسخة الاحتياطية بنجاح';
            advancedChat.showToast('تم إنشاء النسخة الاحتياطية بنجاح');
        }).catch(error => {
            console.error('Error creating backup:', error);
            backupStatus.textContent = 'خطأ في إنشاء النسخة الاحتياطية';
            advancedChat.showToast('خطأ في إنشاء النسخة الاحتياطية');
        });
    }, 3000);
}

function loadBackupsList() {
    const backupsList = document.getElementById('backupList');
    backupsList.innerHTML = '';
    
    // تحميل النسخ الاحتياطية من Firestore
    db.collection('backups')
        .orderBy('createdAt', 'desc')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const backup = doc.data();
                
                const backupItem = document.createElement('div');
                backupItem.className = 'backup-item';
                
                // تنسيق التاريخ
                let dateText = '';
                if (backup.createdAt) {
                    const date = backup.createdAt.toDate();
                    dateText = date.toLocaleDateString('ar-EG', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                
                backupItem.innerHTML = `
                    <div class="backup-info">
                        <h4>${backup.type === 'manual' ? 'نسخة يدوية' : 'نسخة تلقائية'}</h4>
                        <div class="backup-date">${dateText}</div>
                    </div>
                    <div class="backup-actions">
                        <button class="btn-outline" onclick="restoreBackup('${doc.id}')">استعادة</button>
                        <button class="btn-outline" onclick="deleteBackup('${doc.id}')">حذف</button>
                    </div>
                `;
                
                backupsList.appendChild(backupItem);
            });
        })
        .catch(error => {
            console.error('Error loading backups:', error);
        });
}

function restoreBackup(backupId) {
    advancedChat.showToast('جاري استعادة النسخة الاحتياطية...');
    
    // محاكاة عملية استعادة النسخة الاحتياطية
    setTimeout(() => {
        advancedChat.showToast('تم استعادة النسخة الاحتياطية بنجاح');
        document.getElementById('restoreBackupModal').style.display = 'none';
    }, 3000);
}

function deleteBackup(backupId) {
    if (confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
        db.collection('backups').doc(backupId).delete()
            .then(() => {
                advancedChat.showToast('تم حذف النسخة الاحتياطية');
                loadBackupsList();
            })
            .catch(error => {
                console.error('Error deleting backup:', error);
                advancedChat.showToast('خطأ في حذف النسخة الاحتياطية');
            });
    }
}

function initWhiteboard() {
    const canvas = document.getElementById('whiteboardCanvas');
    const ctx = canvas.getContext('2d');
    
    // تعيين أبعاد اللوحة
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // تعيين الخلفية البيضاء
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let isDrawing = false;
    let currentTool = 'pen';
    let currentColor = '#000000';
    
    // تحديد الأداة الحالية
    document.querySelectorAll('.whiteboard-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            if (this.dataset.tool) {
                currentTool = this.dataset.tool;
            }
        });
    });
    
    // تحديد اللون الحالي
    document.getElementById('whiteboardColor').addEventListener('change', function() {
        currentColor = this.value;
    });
    
    // وظائف الرسم
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // للهواتف
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = currentTool === 'eraser' ? 20 : 2;
        ctx.lineCap = 'round';
        
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function clearWhiteboard() {
    const canvas = document.getElementById('whiteboardCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveWhiteboard() {
    const canvas = document.getElementById('whiteboardCanvas');
    
    canvas.toBlob(blob => {
        // رفع الصورة إلى Firebase Storage
        const fileRef = storage.ref().child(`whiteboards/${advancedChat.currentUser.uid}/${Date.now()}.png`);
        
        fileRef.put(blob).then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
            // إرسال رسالة مع رابط الصورة
            advancedChat.sendMessage(
                '🎨 سبورة مشتركة',
                'image',
                {
                    imageUrl: downloadURL,
                    isWhiteboard: true
                }
            );
            
            // إغلاق السبورة
            document.getElementById('whiteboardContainer').style.display = 'none';
            
            advancedChat.showToast('تم حفظ السبورة ومشاركتها');
        }).catch(error => {
            console.error('Error saving whiteboard:', error);
            advancedChat.showToast('خطأ في حفظ السبورة');
        });
    });
}

function loadProfileData() {
    if (!advancedChat.currentUser) return;
    
    const user = advancedChat.currentUser;
    
    // تحديث معلومات الملف الشخصي
    document.getElementById('profileName').textContent = user.displayName || 'مستخدم';
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileStatus').textContent = 'متصل';
    
    // تحميل تاريخ الانضمام من Firestore
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.createdAt) {
                    const joinDate = userData.createdAt.toDate();
                    document.getElementById('profileJoinDate').textContent = joinDate.toLocaleDateString('ar-EG');
                }
            }
        })
        .catch(error => {
            console.error('Error loading profile data:', error);
        });
}

function loadUsersList() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    // تحميل المستخدمين من Firestore
    db.collection('users')
        .where('uid', '!=', advancedChat.currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const user = doc.data();
                
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-avatar">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=128C7E&color=fff" alt="${user.displayName || user.email}">
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user.displayName || user.email.split('@')[0]}</div>
                        <div class="user-status">${user.isOnline ? 'متصل' : 'غير متصل'}</div>
                    </div>
                    ${user.isOnline ? '<div class="user-online-indicator"></div>' : ''}
                `;
                
                userItem.addEventListener('click', () => {
                    advancedChat.createConversation(user.uid, user.displayName || user.email.split('@')[0]);
                    document.getElementById('newConversationModal').style.display = 'none';
                });
                
                usersList.appendChild(userItem);
            });
        })
        .catch(error => {
            console.error('Error loading users list:', error);
        });
}

function filterUsersList(searchTerm) {
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const userName = item.querySelector('.user-name').textContent.toLowerCase();
        
        if (userName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function voteOnPoll(messageId, optionIndex) {
    // التحقق مما إذا كان المستخدم قد صوت بالفعل
    db.collection('pollVotes')
        .where('messageId', '==', messageId)
        .where('userId', '==', advancedChat.currentUser.uid)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                // إضافة تصويت جديد
                db.collection('pollVotes').add({
                    messageId: messageId,
                    userId: advancedChat.currentUser.uid,
                    optionIndex: optionIndex,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    // تحديث عدد الأصوات في الرسالة
                    db.collection('messages').doc(messageId).get()
                        .then(doc => {
                            if (doc.exists) {
                                const message = doc.data();
                                const options = [...message.options];
                                options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
                                
                                db.collection('messages').doc(messageId).update({
                                    options: options
                                }).then(() => {
                                    // إعادة تحميل الرسائل
                                    advancedChat.loadMessages(advancedChat.currentConversation);
                                    advancedChat.showToast('تم تسجيل تصويتك');
                                }).catch(error => {
                                    console.error('Error updating poll:', error);
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error getting poll message:', error);
                        });
                }).catch(error => {
                    console.error('Error adding vote:', error);
                });
            } else {
                advancedChat.showToast('لقد صوتت بالفعل في هذا الاستطلاع');
            }
        })
        .catch(error => {
            console.error('Error checking existing vote:', error);
        });
}

// إضافة مستمعي الأحداث للأزرار التي تمت إضافتها ديناميكيًا
document.addEventListener('DOMContentLoaded', function() {
    // مستمعو الأحداث لأزرار حذف خيارات استطلاع الرأي
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-option')) {
            e.target.closest('.poll-option-input').remove();
        }
    });
    
    // مستمعو الأحداث لأزرار التبديل في الإعدادات
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-switch')) {
            e.target.classList.toggle('active');
        }
    });
    
    // مستمعو الأحداث لتغيير حجم مربع الإدخال
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
    
    // مستمعو الأحداث لتغيير حجم النافذة
    window.addEventListener('resize', function() {
        const whiteboardCanvas = document.getElementById('whiteboardCanvas');
        if (whiteboardCanvas && document.getElementById('whiteboardContainer').style.display === 'block') {
            whiteboardCanvas.width = window.innerWidth;
            whiteboardCanvas.height = window.innerHeight;
        }
    });
    
    // مستمعو الأحداث للتنقل بين علامات التبويب في الإعدادات
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('settings-tab')) {
            const tabName = e.target.dataset.tab;
            
            // تحديث علامات التبويب
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // تحديث المحتوى
            document.querySelectorAll('.settings-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabName}-panel`).classList.add('active');
        }
    });
    
    // مستمعو الأحداث للأزرار السريعة للرد
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-reply-btn')) {
            const replyText = e.target.dataset.reply;
            document.getElementById('chatInput').value = replyText;
            sendMessage();
        }
    });
});

// إضافة دعم للوحة المفاتيح للتنقل
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K للبحث
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBar = document.getElementById('chatSearchBar');
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        if (searchBar.style.display === 'block') {
            document.getElementById('chatSearch').focus();
        }
    }
    
    // Ctrl/Cmd + N لمحادثة جديدة
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('newConversationModal').style.display = 'flex';
        loadUsersList();
    }
    
    // Ctrl/Cmd + G لمجموعة جديدة
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        document.getElementById('createGroupModal').style.display = 'flex';
    }
    
    // Ctrl/Cmd + P لاستطلاع رأي جديد
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        document.getElementById('createPollModal').style.display = 'flex';
    }
    
    // Ctrl/Cmd + S للسبورة
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('whiteboardContainer').style.display = 'block';
        initWhiteboard();
    }
    
    // Ctrl/Cmd + D للوحة التحكم
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('adminDashboard').style.display = 'block';
        loadDashboardData();
    }
    
    // Ctrl/Cmd + B للنسخ الاحتياطي
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        createBackup();
    }
    
    // Ctrl/Cmd + I للإعدادات
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        document.getElementById('settingsModal').style.display = 'flex';
    }
    
    // Ctrl/Cmd + U للملف الشخصي
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.getElementById('profileModal').style.display = 'flex';
        loadProfileData();
    }
    
    // Ctrl/Cmd + L لتسجيل الخروج
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            auth.signOut();
        }
    }
});

// إضافة دعم للسحب والإفلات للملفات
document.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            advancedChat.handleFileUpload(files[i]);
        }
    }
});

// إضافة دعم للصق الصور
document.addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const file = new File([blob], 'pasted-image.png', { type: 'image/png' });
            advancedChat.handleFileUpload(file);
        }
    }
});

// إضافة دعم للإشعارات
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
        }
    });
}

// إضافة دعم للخدمات العمالة (Service Worker)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered');
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// إضافة دعم للتحديثات التلقائية
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    const installButton = document.createElement('button');
    installButton.textContent = 'تثبيت التطبيق';
    installButton.className = 'install-button';
    installButton.addEventListener('click', function() {
        e.prompt();
        e.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
        });
    });
    document.body.appendChild(installButton);
});

// إضافة دعم للتحليلات
if ('analytics' in window) {
    // تتبع استخدام التطبيق
    window.analytics.track('app_opened', {
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        language: navigator.language
    });
}

// إضافة دعم للأخطاء
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // إرسال الخطأ إلى Firebase
    if (advancedChat && advancedChat.currentUser) {
        db.collection('errors').add({
            userId: advancedChat.currentUser.uid,
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error.stack,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});

// إضافة دعم للأداء
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        // إرسال بيانات الأداء إلى Firebase
        if (advancedChat && advancedChat.currentUser) {
            db.collection('performance').add({
                userId: advancedChat.currentUser.uid,
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    });
}

// إضافة دعم للاتصال بالإنترنت
window.addEventListener('online', function() {
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.textContent = 'متصل';
    connectionStatus.className = 'connection-status connected';
    
    if (advancedChat && advancedChat.currentUser) {
        db.collection('users').doc(advancedChat.currentUser.uid).update({
            isOnline: true,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});

window.addEventListener('offline', function() {
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.textContent = 'غير متصل';
    connectionStatus.className = 'connection-status disconnected';
    
    if (advancedChat && advancedChat.currentUser) {
        db.collection('users').doc(advancedChat.currentUser.uid).update({
            isOnline: false,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});

// إضافة دعم لتغيير حجم الخط
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Plus لزيادة حجم الخط
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = Math.min(currentSize + 2, 24) + 'px';
    }
    
    // Ctrl/Cmd + Minus لتقليل حجم الخط
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = Math.max(currentSize - 2, 12) + 'px';
    }
    
    // Ctrl/Cmd + 0 لإعادة تعيين حجم الخط
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        document.body.style.fontSize = '16px';
    }
});

// إضافة دعم للطباعة
window.addEventListener('beforeprint', function() {
    // إخفاء العناصر غير الضرورية للطباعة
    document.querySelectorAll('.chat-actions, .chat-input-container, .floating-action-button, .quick-actions-panel, .conversations-sidebar').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', function() {
    // إظهار العناصر بعد الطباعة
    document.querySelectorAll('.chat-actions, .chat-input-container, .floating-action-button, .quick-actions-panel, .conversations-sidebar').forEach(el => {
        el.style.display = '';
    });
});

// إضافة دعم للملء التلقائي
document.addEventListener('input', function(e) {
    if (e.target.id === 'chatInput') {
        const text = e.target.value;
        const lastWord = text.split(' ').pop();
        
        // التحقق من وجود إشارة للمستخدم
        if (lastWord.startsWith('@')) {
            const username = lastWord.substring(1);
            const users = Array.from(advancedChat.users.values());
            const matchingUsers = users.filter(user => 
                user.displayName && user.displayName.toLowerCase().includes(username.toLowerCase())
            );
            
            if (matchingUsers.length > 0) {
                // عرض قائمة المستخدمين المتطابقة
                showUserSuggestions(matchingUsers, e.target);
            }
        }
    }
});

function showUserSuggestions(users, inputElement) {
    // إزالة قائمة الاقتراحات الحالية
    const existingSuggestions = document.querySelector('.user-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    // إنشاء قائمة اقتراحات جديدة
    const suggestionsList = document.createElement('div');
    suggestionsList.className = 'user-suggestions';
    suggestionsList.style.cssText = `
        position: absolute;
        bottom: 60px;
        left: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
    `;
    
    users.forEach(user => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.style.cssText = `
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
        `;
        suggestionItem.textContent = user.displayName;
        
        suggestionItem.addEventListener('click', function() {
            const text = inputElement.value;
            const words = text.split(' ');
            words[words.length - 1] = '@' + user.displayName;
            inputElement.value = words.join(' ') + ' ';
            suggestionsList.remove();
        });
        
        suggestionsList.appendChild(suggestionItem);
    });
    
    inputElement.parentElement.appendChild(suggestionsList);
}

// إغلاق قائمة الاقتراحات عند النقر خارجها
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-suggestions') && e.target.id !== 'chatInput') {
        const suggestions = document.querySelector('.user-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
});

// ===== نهاية الملف =====