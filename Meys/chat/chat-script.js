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
        const usersSnapshot = await db.collection('users')
            .where('username', '==', username)
            .get();
        
        if (!usersSnapshot.empty) {
            return usersSnapshot.docs[0].data();
        }
        return null;
    }

    sendGroupInvitationNotification(groupId, userId, invitedBy) {
        // إرسال إشعار دعوة للمجموعة
        console.log(`Sending group invitation to ${userId}`);
    }
}

// 3. نظام الحالة (Status)
class StatusSystem {
    constructor() {
        this.statusDuration = 24 * 60 * 60 * 1000; // 24 ساعة
        this.userStatuses = new Map();
    }

    // نشر حالة جديدة
    async postStatus(statusData) {
        const statusId = advancedChat.generateId('status');
        
        const status = {
            id: statusId,
            userId: advancedChat.currentUser.uid,
            type: statusData.type,
            content: statusData.content,
            backgroundColor: statusData.backgroundColor,
            textColor: statusData.textColor,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.statusDuration),
            viewers: [],
            viewCount: 0,
            privacy: statusData.privacy || 'contacts'
        };

        await db.collection('statuses').doc(statusId).set(status);
        this.updateUserStatusList(advancedChat.currentUser.uid, statusId);
        
        return statusId;
    }

    // مشاهدة حالة
    async viewStatus(statusId, viewerId) {
        const statusRef = db.collection('statuses').doc(statusId);
        
        await statusRef.update({
            viewers: firebase.firestore.FieldValue.arrayUnion(viewerId),
            viewCount: firebase.firestore.FieldValue.increment(1)
        });

        await db.collection('statusViews').add({
            statusId: statusId,
            viewerId: viewerId,
            viewedAt: new Date()
        });
    }

    // الحصول على حالات الأصدقاء
    async getFriendStatuses() {
        const contacts = await this.getUserContacts();
        const statuses = [];

        for (const contact of contacts) {
            const contactStatuses = await db.collection('statuses')
                .where('userId', '==', contact.userId)
                .where('expiresAt', '>', new Date())
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

            if (!contactStatuses.empty) {
                const status = contactStatuses.docs[0].data();
                statuses.push({
                    ...status,
                    userInfo: contact
                });
            }
        }

        return statuses;
    }

    // تنظيف الحالات المنتهية
    async cleanupExpiredStatuses() {
        const expiredStatuses = await db.collection('statuses')
            .where('expiresAt', '<=', new Date())
            .get();

        const batch = db.batch();
        expiredStatuses.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

    // إعدادات خصوصية الحالة
    async updateStatusPrivacy(privacySettings) {
        await db.collection('users').doc(advancedChat.currentUser.uid).update({
            statusPrivacy: privacySettings
        });
    }

    updateUserStatusList(userId, statusId) {
        if (!this.userStatuses.has(userId)) {
            this.userStatuses.set(userId, []);
        }
        this.userStatuses.get(userId).push(statusId);
    }

    async getUserContacts() {
        // محاكاة جهات الاتصال
        return [
            {
                userId: 'contact1',
                name: 'محمد أحمد',
                avatar: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=128C7E&color=fff'
            },
            {
                userId: 'contact2',
                name: 'أحمد التقني',
                avatar: 'https://ui-avatars.com/api/?name=أحمد+التقني&background=25D366&color=fff'
            }
        ];
    }
}

// 4. نظام الوسائط المتقدم
class AdvancedMediaSystem {
    constructor() {
        this.maxFileSize = 100 * 1024 * 1024; // 100 MB
        this.supportedFormats = {
            images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            videos: ['mp4', 'avi', 'mov', 'mkv'],
            documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
            audio: ['mp3', 'wav', 'ogg', 'm4a']
        };
        this.liveLocations = new Map();
    }

    // مشاركة الموقع الجغرافي
    async shareLiveLocation(conversationId, duration = 3600000) {
        const locationId = advancedChat.generateId('location');
        
        if (!navigator.geolocation) {
            throw new Error('المتصفح لا يدعم خدمة الموقع');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const locationData = {
                        id: locationId,
                        conversationId: conversationId,
                        userId: advancedChat.currentUser.uid,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(),
                        duration: duration,
                        isActive: true
                    };

                    try {
                        await db.collection('liveLocations').doc(locationId).set(locationData);
                        this.startLocationUpdates(locationId, duration);
                        resolve(locationId);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    reject(this.getLocationError(error));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // تحديث الموقع تلقائياً
    startLocationUpdates(locationId, duration) {
        const updateInterval = setInterval(async () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await db.collection('liveLocations').doc(locationId).update({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        lastUpdated: new Date()
                    });
                },
                (error) => {
                    console.error('Error updating location:', error);
                }
            );
        }, 30000);

        setTimeout(() => {
            clearInterval(updateInterval);
            this.stopLiveLocation(locationId);
        }, duration);
    }

    // إيقاف مشاركة الموقع
    async stopLiveLocation(locationId) {
        await db.collection('liveLocations').doc(locationId).update({
            isActive: false,
            endedAt: new Date()
        });
    }

    // رفع الملفات مع التحقق
    async uploadFile(file, conversationId) {
        if (file.size > this.maxFileSize) {
            throw new Error(`حجم الملف يتجاوز الحد المسموح (${this.maxFileSize / 1024 / 1024} MB)`);
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();
        const fileType = this.getFileType(fileExtension);
        
        if (!fileType) {
            throw new Error('نوع الملف غير مدعوم');
        }

        const filePath = `files/${advancedChat.currentUser.uid}/${Date.now()}_${file.name}`;
        const fileRef = storage.ref().child(filePath);
        const uploadTask = fileRef.put(file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.updateUploadProgress(file.name, progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        
                        const fileData = {
                            id: advancedChat.generateId('file'),
                            name: file.name,
                            size: file.size,
                            type: fileType,
                            extension: fileExtension,
                            url: downloadURL,
                            uploadedBy: advancedChat.currentUser.uid,
                            uploadedAt: new Date(),
                            conversationId: conversationId
                        };

                        await db.collection('files').doc(fileData.id).set(fileData);
                        resolve(fileData);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    // إرسال تسجيل صوتي
    async sendVoiceMessage(conversationId, audioBlob, duration) {
        const audioId = advancedChat.generateId('audio');
        const audioFileName = `voice_${audioId}.webm`;

        const audioRef = storage.ref().child(`voice_notes/${advancedChat.currentUser.uid}/${audioFileName}`);
        const uploadTask = audioRef.put(audioBlob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        
                        const voiceMessage = {
                            id: audioId,
                            conversationId: conversationId,
                            senderId: advancedChat.currentUser.uid,
                            type: 'voice',
                            url: downloadURL,
                            duration: duration,
                            timestamp: new Date(),
                            status: 'sent'
                        };

                        await db.collection('messages').doc(audioId).set(voiceMessage);
                        resolve(audioId);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    getFileType(extension) {
        for (const [type, extensions] of Object.entries(this.supportedFormats)) {
            if (extensions.includes(extension)) {
                return type;
            }
        }
        return null;
    }

    updateUploadProgress(fileName, progress) {
        console.log(`Upload progress for ${fileName}: ${progress}%`);
    }

    getLocationError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                return "تم رفض إذن الموقع";
            case error.POSITION_UNAVAILABLE:
                return "معلومات الموقع غير متاحة";
            case error.TIMEOUT:
                return "انتهت مهلة طلب الموقع";
            default:
                return "حدث خطأ غير معروف";
        }
    }
}

// 5. نظام الأمان والخصوصية المتقدم
class AdvancedSecuritySystem {
    constructor() {
        this.encryptionKey = null;
        this.privacySettings = new Map();
    }

    // تشفير end-to-end
    async initializeEncryption() {
        try {
            if (window.crypto && crypto.subtle) {
                this.encryptionKey = await crypto.subtle.generateKey(
                    {
                        name: "AES-GCM",
                        length: 256,
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                await this.exchangeKeysWithContacts();
            }
        } catch (error) {
            console.warn('Encryption not available:', error);
        }
    }

    // تشفير الرسالة
    async encryptMessage(message) {
        if (!this.encryptionKey) return message;

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                this.encryptionKey,
                data
            );

            return {
                encrypted: Array.from(new Uint8Array(encrypted)),
                iv: Array.from(iv)
            };
        } catch (error) {
            console.warn('Encryption failed:', error);
            return message;
        }
    }

    // فك تشفير الرسالة
    async decryptMessage(encryptedData) {
        if (!this.encryptionKey || typeof encryptedData === 'string') {
            return encryptedData;
        }

        try {
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: new Uint8Array(encryptedData.iv)
                },
                this.encryptionKey,
                new Uint8Array(encryptedData.encrypted)
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.warn('Decryption failed:', error);
            return encryptedData;
        }
    }

    // إعدادات الخصوصية
    async updatePrivacySettings(settings) {
        this.privacySettings = new Map(Object.entries(settings));
        
        await db.collection('users').doc(advancedChat.currentUser.uid).update({
            privacySettings: settings,
            lastSeen: settings.lastSeen === 'nobody' ? null : new Date(),
            profilePicture: settings.profilePicture,
            status: settings.status,
            readReceipts: settings.readReceipts
        });
    }

    // إخفاء آخر ظهور
    getLastSeenPrivacy(userId) {
        const settings = this.privacySettings.get('lastSeen') || 'everyone';
        
        switch(settings) {
            case 'everyone':
                return true;
            case 'contacts':
                return this.isContact(userId);
            case 'nobody':
                return false;
            default:
                return true;
        }
    }

    // التحقق بخطوتين
    async setupTwoFactorAuth() {
        // محاكاة التحقق بخطوتين
        const secret = this.generateSecret();
        
        await db.collection('users').doc(advancedChat.currentUser.uid).update({
            twoFactorEnabled: true,
            twoFactorSecret: secret
        });

        return this.generateQRCode(secret);
    }

    // التحقق من الرمز
    async verifyTwoFactorCode(code) {
        const userDoc = await db.collection('users').doc(advancedChat.currentUser.uid).get();
        const user = userDoc.data();
        
        // محاكاة التحقق من الرمز
        return code.length === 6 && /^\d+$/.test(code);
    }

    async exchangeKeysWithContacts() {
        // محاكاة تبادل المفاتيح
        console.log('Exchanging encryption keys with contacts');
    }

    isContact(userId) {
        // محاكاة التحقق من جهة الاتصال
        return true;
    }

    generateSecret() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    generateQRCode(secret) {
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">QR Code for: ${secret}</svg>`;
    }
}

// 6. نظام متعدد الأجهزة
class MultiDeviceSystem {
    constructor() {
        this.connectedDevices = new Map();
        this.syncSessions = new Map();
    }

    // بدء جلسة متعددة الأجهزة
    async startMultiDeviceSession(deviceInfo) {
        const sessionId = advancedChat.generateId('session');
        
        const session = {
            id: sessionId,
            userId: advancedChat.currentUser.uid,
            deviceInfo: deviceInfo,
            connectedAt: new Date(),
            lastActive: new Date(),
            isActive: true,
            ipAddress: deviceInfo.ip,
            userAgent: deviceInfo.userAgent
        };

        await db.collection('sessions').doc(sessionId).set(session);
        await this.syncConversationsToDevice(sessionId);
        
        return sessionId;
    }

    // مزامنة المحادثات
    async syncConversationsToDevice(sessionId) {
        const conversations = await db.collection('conversations')
            .where('participants', 'array-contains', advancedChat.currentUser.uid)
            .get();

        const batch = db.batch();
        
        conversations.forEach(doc => {
            const conversation = doc.data();
            const syncRef = db.collection('syncQueue').doc();
            
            batch.set(syncRef, {
                type: 'conversation',
                sessionId: sessionId,
                conversationId: conversation.id,
                data: conversation,
                timestamp: new Date()
            });
        });

        await batch.commit();
    }

    // إدارة الجلسات النشطة
    async getActiveSessions() {
        const sessions = await db.collection('sessions')
            .where('userId', '==', advancedChat.currentUser.uid)
            .where('isActive', '==', true)
            .get();

        return sessions.docs.map(doc => doc.data());
    }

    // إنهاء جلسة جهاز
    async endDeviceSession(sessionId) {
        await db.collection('sessions').doc(sessionId).update({
            isActive: false,
            endedAt: new Date()
        });
    }

    // مزامنة الرسائل في الوقت الحقيقي
    setupRealTimeSync() {
        db.collection('messages')
            .where('recipients', 'array-contains', advancedChat.currentUser.uid)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        this.handleNewMessage(change.doc.data());
                    }
                });
            });

        db.collection('statuses')
            .where('userId', 'in', this.getContactIds())
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        this.handleNewStatus(change.doc.data());
                    }
                });
            });
    }

    handleNewMessage(message) {
        console.log('New message received:', message);
    }

    handleNewStatus(status) {
        console.log('New status received:', status);
    }

    async getContactIds() {
        // محاكاة جهات الاتصال
        return ['contact1', 'contact2'];
    }
}

// 7. نظام النسخ الاحتياطي المتقدم
class AdvancedBackupSystem {
    constructor() {
        this.backupIntervals = {
            DAILY: 24 * 60 * 60 * 1000,
            WEEKLY: 7 * 24 * 60 * 60 * 1000,
            MONTHLY: 30 * 24 * 60 * 60 * 1000
        };
        this.autoBackupEnabled = true;
    }

    // إنشاء نسخة احتياطية كاملة
    async createFullBackup() {
        const backupId = advancedChat.generateId('backup');
        const timestamp = new Date();
        
        const backupData = {
            id: backupId,
            userId: advancedChat.currentUser.uid,
            timestamp: timestamp,
            conversations: await this.backupConversations(),
            messages: await this.backupMessages(),
            media: await this.backupMediaMetadata(),
            contacts: await this.backupContacts(),
            settings: await this.backupSettings()
        };

        localStorage.setItem(`backup_${backupId}`, JSON.stringify(backupData));
        
        if (this.isCloudBackupEnabled()) {
            await this.uploadBackupToCloud(backupData);
        }

        advancedChat.showToast('تم إنشاء نسخة احتياطية بنجاح');
        return backupId;
    }

    // نسخ المحادثات احتياطياً
    async backupConversations() {
        const conversations = await db.collection('conversations')
            .where('participants', 'array-contains', advancedChat.currentUser.uid)
            .get();

        return conversations.docs.map(doc => doc.data());
    }

    // نسخ الرسائل احتياطياً
    async backupMessages() {
        const messages = await db.collection('messages')
            .where('senderId', '==', advancedChat.currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(1000)
            .get();

        return messages.docs.map(doc => {
            const message = doc.data();
            return {
                id: message.id,
                text: message.text,
                conversationId: message.conversationId,
                timestamp: message.timestamp,
                type: message.type
            };
        });
    }

    // استعادة من نسخة احتياطية
    async restoreFromBackup(backupId) {
        const backupData = localStorage.getItem(`backup_${backupId}`);
        
        if (!backupData) {
            throw new Error('النسخة الاحتياطية غير موجودة');
        }

        const backup = JSON.parse(backupData);
        
        for (const conversation of backup.conversations) {
            await this.restoreConversation(conversation);
        }

        for (const message of backup.messages) {
            await this.restoreMessage(message);
        }

        await this.restoreSettings(backup.settings);

        advancedChat.showToast('تم استعادة النسخة الاحتياطية بنجاح');
        return true;
    }

    // النسخ الاحتياطي التلقائي
    setupAutoBackup() {
        if (this.autoBackupEnabled) {
            setInterval(async () => {
                if (this.shouldCreateBackup()) {
                    await this.createFullBackup();
                }
            }, this.backupIntervals.DAILY);
        }
    }

    // إدارة مساحة التخزين
    async manageStorage() {
        const backups = this.getAvailableBackups();
        
        if (backups.length > 5) {
            const oldBackups = backups.slice(5);
            for (const backup of oldBackups) {
                localStorage.removeItem(`backup_${backup.id}`);
            }
        }
    }

    async backupMediaMetadata() {
        const media = await db.collection('files')
            .where('uploadedBy', '==', advancedChat.currentUser.uid)
            .get();

        return media.docs.map(doc => doc.data());
    }

    async backupContacts() {
        return []; // محاكاة جهات الاتصال
    }

    async backupSettings() {
        const userDoc = await db.collection('users').doc(advancedChat.currentUser.uid).get();
        return userDoc.data();
    }

    async restoreConversation(conversation) {
        // محاكاة استعادة المحادثة
        console.log('Restoring conversation:', conversation.id);
    }

    async restoreMessage(message) {
        // محاكاة استعادة الرسالة
        console.log('Restoring message:', message.id);
    }

    async restoreSettings(settings) {
        // محاكاة استعادة الإعدادات
        console.log('Restoring settings');
    }

    isCloudBackupEnabled() {
        return false; // محاكاة
    }

    async uploadBackupToCloud(backupData) {
        // محاكاة الرفع للسحابة
        console.log('Uploading backup to cloud');
    }

    shouldCreateBackup() {
        return true; // محاكاة
    }

    getAvailableBackups() {
        const backups = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('backup_')) {
                try {
                    const backupData = JSON.parse(localStorage.getItem(key));
                    backups.push(backupData);
                } catch (error) {
                    console.error('Error parsing backup:', error);
                }
            }
        }
        return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
}

// =============================================
// باقي المحركات المتخصصة
// =============================================

class AnalyticsEngine {
    constructor() {
        this.events = [];
        this.metrics = new Map();
    }

    track(event, data) {
        const eventData = {
            event,
            ...data,
            timestamp: new Date()
        };
        
        this.events.push(eventData);
        this.updateMetrics(event, data);
        this.saveEventToFirebase(eventData);
    }

    updateMetrics(event, data) {
        switch(event) {
            case 'message_sent':
                this.incrementMetric('total_messages');
                this.incrementMetric(`user_${data.userId}_messages`);
                break;
            case 'user_online':
                this.incrementMetric('online_users');
                break;
            case 'user_offline':
                this.decrementMetric('online_users');
                break;
            case 'conversation_created':
                this.incrementMetric('total_conversations');
                break;
        }
    }

    incrementMetric(metric) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, current + 1);
    }

    decrementMetric(metric) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, Math.max(0, current - 1));
    }

    async saveEventToFirebase(eventData) {
        try {
            await db.collection('analytics').add(eventData);
        } catch (error) {
            console.error('Error saving analytics event:', error);
        }
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = ['default', 'dark', 'blue', 'purple'];
    }

    setTheme(themeName) {
        if (this.themes.includes(themeName)) {
            document.body.classList.remove(...this.themes.map(t => `theme-${t}`));
            document.body.classList.add(`theme-${themeName}`);
            this.currentTheme = themeName;
            this.saveThemePreference(themeName);
            return true;
        }
        return false;
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    saveThemePreference(theme) {
        localStorage.setItem('chat-theme', theme);
    }

    loadThemePreference() {
        const saved = localStorage.getItem('chat-theme');
        if (saved && this.themes.includes(saved)) {
            this.setTheme(saved);
        }
    }
}

class CollaborationTools {
    constructor() {
        this.whiteboard = null;
    }

    initCollaborationTools() {
        console.log('Initializing collaboration tools');
        this.whiteboard = new Whiteboard();
        this.whiteboard.init();
    }

    startWhiteboardSession(roomId) {
        if (this.whiteboard) {
            this.whiteboard.show();
            return true;
        }
        return false;
    }
}

class GamificationEngine {
    constructor() {
        this.points = new Map();
        this.achievements = new Map();
        this.leaderboard = new Map();
        this.initializeAchievements();
    }

    initializeAchievements() {
        this.achievements.set('chat_enthusiast', {
            title: 'متحمس المحادثة',
            description: 'أرسل 100 رسالة',
            points: 100,
            icon: '💬'
        });

        this.achievements.set('group_creator', {
            title: 'منشئ المجموعات',
            description: 'أنشئ 5 مجموعات',
            points: 200,
            icon: '👥'
        });

       
    }

    awardPoints(userId, points, reason) {
        const current = this.points.get(userId) || 0;
        this.points.set(userId, current + points);
        this.updateLeaderboard(userId, current + points);
        this.savePointsToStorage(userId, current + points);
    }

    updateLeaderboard(userId, points) {
        this.leaderboard.set(userId, points);
        const sorted = Array.from(this.leaderboard.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        this.leaderboard = new Map(sorted);
    }

    getUserStats(userId) {
        return {
            points: this.points.get(userId) || 0,
            achievements: this.getUserAchievements(userId),
            rank: this.getUserRank(userId)
        };
    }

    getUserAchievements(userId) {
        return ['chat_enthusiast'];
    }

    getUserRank(userId) {
        const sorted = Array.from(this.leaderboard.entries())
            .sort((a, b) => b[1] - a[1]);
        const index = sorted.findIndex(entry => entry[0] === userId);
        return index >= 0 ? index + 1 : null;
    }

    getAchievementInfo(achievementId) {
        return this.achievements.get(achievementId) || {
            title: 'إنجاز',
            description: 'إنجاز متميز',
            points: 0,
            icon: '🏆'
        };
    }

    savePointsToStorage(userId, points) {
        localStorage.setItem(`user_${userId}_points`, points.toString());
    }
}

class AdminTools {
    constructor() {
        this.stats = {
            totalUsers: 0,
            totalMessages: 0,
            activeConversations: 0,
            onlineUsers: 0
        };
    }

    async getSystemStats() {
        return {
            totalUsers: 150,
            totalMessages: 2547,
            activeConversations: 12,
            onlineUsers: 23,
            systemLoad: '45%',
            storageUsed: '2.3GB'
        };
    }

    async moderateContent(contentId, action, reason) {
        console.log(`Moderating content ${contentId}: ${action} - ${reason}`);
        return true;
    }

    async manageUser(userId, action, data) {
        console.log(`Managing user ${userId}: ${action}`, data);
        return true;
    }
}

class IntegrationManager {
    constructor() {
        this.connectedPlatforms = new Set();
    }

    async connect(platform, credentials) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connectedPlatforms.add(platform);
                resolve({
                    platform,
                    connected: true,
                    sync: () => this.syncPlatform(platform)
                });
            }, 1000);
        });
    }

    async syncPlatform(platform) {
        console.log(`Syncing with ${platform}`);
        return true;
    }
}

class Whiteboard {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.brushSize = 3;
        this.lastX = 0;
        this.lastY = 0;
    }

    init() {
        this.canvas = document.getElementById('whiteboardCanvas');
        if (!this.canvas) {
            console.error('Whiteboard canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvasSize();
        this.setupEventListeners();
        this.setupToolbar();
    }

    setupCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        window.addEventListener('resize', this.setupCanvasSize.bind(this));
    }

    setupToolbar() {
        const tools = document.querySelectorAll('.whiteboard-tool[data-tool]');
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                this.currentTool = tool.dataset.tool;
            });
        });

        const colorPicker = document.getElementById('whiteboardColor');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.currentColor = e.target.value;
            });
        }

        const clearBtn = document.getElementById('clearWhiteboard');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clear();
            });
        }

        const saveBtn = document.getElementById('saveWhiteboard');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.save();
            });
        }

        const closeBtn = document.getElementById('closeWhiteboard');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const { x, y } = this.getEventCoordinates(e);
        [this.lastX, this.lastY] = [x, y];
    }

    draw(e) {
        if (!this.isDrawing) return;

        const { x, y } = this.getEventCoordinates(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();

        [this.lastX, this.lastY] = [x, y];
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    getEventCoordinates(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }

    handleTouch(e) {
        e.preventDefault();
        if (e.type === 'touchstart') {
            this.startDrawing(e);
        } else if (e.type === 'touchmove') {
            this.draw(e);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `whiteboard-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataURL;
        link.click();
    }

    show() {
        const container = document.getElementById('whiteboardContainer');
        if (container) {
            container.style.display = 'block';
            this.setupCanvasSize();
        }
    }

    hide() {
        const container = document.getElementById('whiteboardContainer');
        if (container) {
            container.style.display = 'none';
        }
    }
}

// =============================================
// التهيئة والإعداد
// =============================================

// إنشاء النظام المتقدم
const advancedChat = new AdvancedChatSystem();

// بيانات النظام الأساسية
let currentUser = null;
let editingMessageId = null;
let replyingToMessage = null;
let voiceRecorder = null;
let mediaRecorder = null;
let audioChunks = [];

// بيانات الإيموجي
const emojis = {
    "وجوه": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
    "قلوب": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
    "أيدي": ["👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "💪"],
    "حيوانات": ["🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄", "🦓", "🦌"],
    "طعام": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️"]
};

// بيانات الردود التلقائية
const autoReplies = {
    "الخدمات": "أقدم خدمات تطوير الويب وتصميم الواجهات وتطبيقات الجوال. أي خدمة تهتم بها تحديداً؟",
    "المشاريع": "يمكنك الاطلاع على مشاريعي السابقة في قسم المشاريع بالموقع. هل لديك مشروع محدد تريد مناقشته؟",
    "الأسعار": "الأسعار تختلف حسب متطلبات المشروع. هل يمكنك مشاركة تفاصيل مشروعك لأعطيك سعراً دقيقاً؟",
    "default": "شكراً على رسالتك! سأرد عليك في أقرب وقت ممكن."
};

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // التهيئة الأساسية
    initChat();
    initEmojis();
    setupEventListeners();
    setupEnhancedUI();
    setupVoiceRecorder();
    
    // تهيئة النظام المتقدم
    setTimeout(() => {
        if (advancedChat && typeof advancedChat.initAdvancedSystem === 'function') {
            advancedChat.initAdvancedSystem().then(() => {
                console.log('Advanced chat system initialized');
            }).catch(error => {
                console.error('Error initializing advanced chat system:', error);
            });
        }
    }, 1000);

    // إعداد مستمعي الأحداث المتقدمة
    setupAdvancedEventListeners();
});

// نظام المصادقة مع Firebase
function initChat() {
    console.log('Initializing chat with Firebase...');
    
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            advancedChat.currentUser = user;
            
            document.getElementById('authBtn').innerHTML = `<i class="fas fa-user"></i> ${user.email}`;
            document.getElementById('userStatus').textContent = 'متصل الآن';
            document.getElementById('connectionStatus').innerHTML = '<i class="fas fa-wifi"></i> متصل';
            document.getElementById('connectionStatus').classList.remove('disconnected');
            document.getElementById('connectionStatus').classList.add('connected');
            
            document.getElementById('chatSearchBar').style.display = 'block';
            
            advancedChat.loadConversations();
            advancedChat.loadUsers();
            
            advancedChat.showToast('تم تسجيل الدخول بنجاح');
        } else {
            currentUser = null;
            advancedChat.currentUser = null;
            
            document.getElementById('authBtn').innerHTML = '<i class="fas fa-user"></i> تسجيل الدخول';
            document.getElementById('userStatus').textContent = 'غير متصل';
            document.getElementById('connectionStatus').innerHTML = '<i class="fas fa-wifi"></i> غير متصل';
            document.getElementById('connectionStatus').classList.remove('connected');
            document.getElementById('connectionStatus').classList.add('disconnected');
            
            document.getElementById('chatSearchBar').style.display = 'none';
            
            if (advancedChat.messagesUnsubscribe) {
                advancedChat.messagesUnsubscribe();
                advancedChat.messagesUnsubscribe = null;
            }
            
            if (advancedChat.conversationsUnsubscribe) {
                advancedChat.conversationsUnsubscribe();
                advancedChat.conversationsUnsubscribe = null;
            }
            
            if (advancedChat.usersUnsubscribe) {
                advancedChat.usersUnsubscribe();
                advancedChat.usersUnsubscribe = null;
            }
            
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <div class="message-content">
                            <h4>مرحباً بك في نظام الدردشة المتكامل المتقدم!</h4>
                            <p>هذا النظام يدعم جميع ميزات الدردشة المتقدمة والإضافية</p>
                            <div class="quick-reply">
                                <button class="quick-reply-btn" data-reply="الخدمات">الخدمات</button>
                                <button class="quick-reply-btn" data-reply="المشاريع">المشاريع</button>
                                <button class="quick-reply-btn" data-reply="الأسعار">الأسعار</button>
                            </div>
                        </div>
                    </div>
                `;
                
                setupQuickReplyButtons();
            }
        }
    });
}

function setupEnhancedUI() {
    // زر البحث المتقدم
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        const advancedSearchBtn = document.createElement('button');
        advancedSearchBtn.className = 'chat-action-btn';
        advancedSearchBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        advancedSearchBtn.title = 'البحث المتقدم';
        advancedSearchBtn.addEventListener('click', () => {
            showAdvancedSearchModal();
        });
        
        chatHeader.querySelector('.chat-actions').prepend(advancedSearchBtn);
    }
}

function showAdvancedSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content" style="max-width: 600px;">
            <div class="auth-modal-header">
                <h3>البحث المتقدم</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="search-input-wrapper" style="margin: 20px 0;">
                <i class="fas fa-search"></i>
                <input type="text" id="advancedSearchInput" placeholder="ابحث في الرسائل والملفات وجهات الاتصال..." style="width: 100%;">
            </div>

            <div id="advancedSearchResults" style="max-height: 400px; overflow-y: auto; margin-top: 20px;">
                <div class="empty-state">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
                    <p>ادخل كلمة للبحث</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#advancedSearchInput');
    const searchResults = modal.querySelector('#advancedSearchResults');

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
                    <p>ادخل كلمة للبحث</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = '<div class="loading">جاري البحث...</div>';

        // محاكاة نتائج البحث
        setTimeout(() => {
            const results = [
                {
                    type: 'message',
                    text: `هذه رسالة تحتوي على "${query}"`,
                    sender: 'محمد أحمد',
                    time: '10:30'
                },
                {
                    type: 'file',
                    name: `ملف عن ${query}.pdf`,
                    sender: 'أنت',
                    time: 'أمس'
                }
            ];

            displaySearchResults(results, searchResults);
        }, 1000);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function displaySearchResults(results, container) {
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد نتائج</div>';
        return;
    }

    results.forEach(result => {
        const resultEl = document.createElement('div');
        resultEl.className = 'search-result-item';
        
        if (result.type === 'message') {
            resultEl.innerHTML = `
                <div class="result-icon">💬</div>
                <div class="result-content">
                    <div class="result-text">${result.text}</div>
                    <div class="result-meta">من: ${result.sender} • ${result.time}</div>
                </div>
            `;
        } else if (result.type === 'file') {
            resultEl.innerHTML = `
                <div class="result-icon">📎</div>
                <div class="result-content">
                    <div class="result-text">${result.name}</div>
                    <div class="result-meta">من: ${result.sender} • ${result.time}</div>
                </div>
            `;
        }
        
        container.appendChild(resultEl);
    });
}

// تحميل المستخدمين من Firebase
function loadUsersList(modal) {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    usersList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">جاري تحميل المستخدمين...</p>';

    setTimeout(() => {
        usersList.innerHTML = '';
        
        let usersFound = false;
        
        if (advancedChat.users && advancedChat.users.size > 0) {
            advancedChat.users.forEach(user => {
                if (!user || !user.uid || user.uid === currentUser.uid) return;

                usersFound = true;
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.2s;
                `;
                userItem.innerHTML = `
                    <div class="user-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #128C7E; color: white; display: flex; align-items: center; justify-content: center; margin-left: 10px;">
                        ${user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0) : 'م')}
                    </div>
                    <div class="user-info">
                        <h4 style="margin: 0;">${user.displayName || (user.email ? user.email.split('@')[0] : 'مستخدم')}</h4>
                        <div style="font-size: 12px; color: #666;">${user.email || 'لا يوجد بريد إلكتروني'}</div>
                    </div>
                `;
                userItem.addEventListener('click', async function() {
                    if (user.uid && (user.displayName || user.email)) {
                        const conversationId = await advancedChat.createConversation(
                            user.uid, 
                            user.displayName || user.email.split('@')[0]
                        );
                        if (conversationId) {
                            advancedChat.switchConversation(conversationId);
                            modal.remove();
                        }
                    } else {
                        advancedChat.showToast('خطأ في بيانات المستخدم');
                    }
                });
                
                userItem.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f5f5f5';
                });
                
                userItem.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                usersList.appendChild(userItem);
            });
        }
        
        if (!usersFound) {
            usersList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">لا يوجد مستخدمين متاحين حالياً</p>';
        }
    }, 1000);
}

// إعداد الإيموجي
function initEmojis() {
    const emojiCategories = document.getElementById('emojiCategories');
    const emojiGrid = document.getElementById('emojiGrid');
    
    if (!emojiCategories || !emojiGrid) return;
    
    Object.keys(emojis).forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'emoji-category';
        categoryBtn.textContent = emojis[category][0];
        categoryBtn.dataset.category = category;
        categoryBtn.addEventListener('click', () => showEmojiCategory(category));
        emojiCategories.appendChild(categoryBtn);
    });
    
    showEmojiCategory(Object.keys(emojis)[0]);
    
    const firstCategory = document.querySelector('.emoji-category');
    if (firstCategory) {
        firstCategory.classList.add('active');
    }
}

function showEmojiCategory(category) {
    const emojiGrid = document.getElementById('emojiGrid');
    if (!emojiGrid) return;
    
    emojiGrid.innerHTML = '';
    
    document.querySelectorAll('.emoji-category').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.emoji-category[data-category="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    emojis[category].forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.className = 'emoji-item';
        emojiBtn.textContent = emoji;
        emojiBtn.addEventListener('click', () => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value += emoji;
                chatInput.focus();
                adjustTextareaHeight();
            }
        });
        emojiGrid.appendChild(emojiBtn);
    });
}

// إعداد مستمعي الأحداث المتقدمة
function setupAdvancedEventListeners() {
    // زر الإجراءات السريعة العائم
    const fabMain = document.getElementById('fabMain');
    const quickActions = document.getElementById('quickActions');

    if (fabMain && quickActions) {
        fabMain.addEventListener('click', function() {
            quickActions.style.display = quickActions.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
            if (!fabMain.contains(e.target) && !quickActions.contains(e.target)) {
                quickActions.style.display = 'none';
            }
        });

        // الإجراءات السريعة
        const quickGroup = document.getElementById('quickGroup');
        const quickPoll = document.getElementById('quickPoll');
        const quickWhiteboard = document.getElementById('quickWhiteboard');
        const quickSchedule = document.getElementById('quickSchedule');
        const quickTheme = document.getElementById('quickTheme');
        const quickDashboard = document.getElementById('quickDashboard');
        const quickStatus = document.getElementById('quickStatus');
        const quickBackup = document.getElementById('quickBackup');

        if (quickGroup) {
            quickGroup.addEventListener('click', function() {
                showCreateGroupModal();
                quickActions.style.display = 'none';
            });
        }

        if (quickPoll) {
            quickPoll.addEventListener('click', function() {
                showCreatePollModal();
                quickActions.style.display = 'none';
            });
        }

        if (quickWhiteboard) {
            quickWhiteboard.addEventListener('click', function() {
                if (advancedChat.collaborationTools) {
                    advancedChat.collaborationTools.startWhiteboardSession('main');
                } else {
                    advancedChat.showToast('أداة السبورة غير متاحة حالياً');
                }
                quickActions.style.display = 'none';
            });
        }

        if (quickSchedule) {
            quickSchedule.addEventListener('click', function() {
                showScheduleMeetingModal();
                quickActions.style.display = 'none';
            });
        }

        if (quickTheme) {
            quickTheme.addEventListener('click', function() {
                if (advancedChat.themeManager) {
                    advancedChat.themeManager.cycleTheme();
                } else {
                    advancedChat.showToast('مدير الثيمات غير متاح حالياً');
                }
                quickActions.style.display = 'none';
            });
        }

        if (quickDashboard) {
            quickDashboard.addEventListener('click', function() {
                showAdminDashboard();
                quickActions.style.display = 'none';
            });
        }

        if (quickStatus) {
            quickStatus.addEventListener('click', function() {
                showStatusModal();
                quickActions.style.display = 'none';
            });
        }

        if (quickBackup) {
            quickBackup.addEventListener('click', function() {
                showBackupManager();
                quickActions.style.display = 'none';
            });
        }
    }

    // زر الحالة
    const statusBtn = document.getElementById('statusBtn');
    if (statusBtn) {
        statusBtn.addEventListener('click', function() {
            showStatusModal();
        });
    }

    // تبديل الثيمات
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (advancedChat.themeManager) {
                advancedChat.themeManager.cycleTheme();
            } else {
                advancedChat.showToast('مدير الثيمات غير متاح حالياً');
            }
        });
    }

    // إدارة المحادثات
    const conversationsToggle = document.getElementById('conversationsToggle');
    const conversationsSidebar = document.getElementById('conversationsSidebar');
    const closeConversations = document.getElementById('closeConversations');
    const createConversationBtn = document.getElementById('createConversationBtn');

    if (conversationsToggle && conversationsSidebar) {
        conversationsToggle.addEventListener('click', function() {
            conversationsSidebar.style.display = conversationsSidebar.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (closeConversations && conversationsSidebar) {
        closeConversations.addEventListener('click', function() {
            conversationsSidebar.style.display = 'none';
        });
    }

    if (createConversationBtn) {
        createConversationBtn.addEventListener('click', function() {
            showCreateConversationModal();
        });
    }

    // التكامل مع المنصات
    const connectSlack = document.getElementById('connectSlack');
    const connectDiscord = document.getElementById('connectDiscord');

    if (connectSlack) {
        connectSlack.addEventListener('click', function() {
            advancedChat.showToast('سيتم دمج Slack قريباً');
        });
    }

    if (connectDiscord) {
        connectDiscord.addEventListener('click', function() {
            advancedChat.showToast('سيتم دمج Discord قريباً');
        });
    }

    // لوحة التحكم
    const closeDashboard = document.getElementById('closeDashboard');
    if (closeDashboard) {
        closeDashboard.addEventListener('click', function() {
            document.getElementById('adminDashboard').style.display = 'none';
        });
    }

    // زر المكالمات الصوتية
    const chatVoiceCall = document.getElementById('chatVoiceCall');
    if (chatVoiceCall) {
        chatVoiceCall.addEventListener('click', function() {
            if (advancedChat.startVoiceCall) {
                advancedChat.startVoiceCall();
            } else {
                advancedChat.showToast('المكالمات الصوتية غير متاحة حالياً');
            }
        });
    }

    // زر المكالمات المرئية
    const chatVideoCall = document.getElementById('chatVideoCall');
    if (chatVideoCall) {
        chatVideoCall.addEventListener('click', function() {
            if (advancedChat.startVideoCall) {
                advancedChat.startVideoCall();
            } else {
                advancedChat.showToast('المكالمات المرئية غير متاحة حالياً');
            }
        });
    }

    // زر مشاركة الموقع
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', function() {
            if (advancedChat.shareCurrentLocation) {
                advancedChat.shareCurrentLocation();
            } else {
                advancedChat.showToast('مشاركة الموقع غير متاحة حالياً');
            }
        });
    }

    // زر رفع الملفات
    const chatAttachmentBtn = document.getElementById('chatAttachmentBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (chatAttachmentBtn && fileInput) {
        chatAttachmentBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                if (advancedChat.handleFileUpload) {
                    Array.from(e.target.files).forEach(file => {
                        advancedChat.handleFileUpload(file);
                    });
                } else {
                    advancedChat.showToast('رفع الملفات غير متاح حالياً');
                }
            }
        });
    }

    // النسخ الاحتياطي
    const createBackupBtn = document.getElementById('createBackupBtn');
    const restoreBackupBtn = document.getElementById('restoreBackupBtn');
    const manageBackupsBtn = document.getElementById('manageBackupsBtn');

    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', async function() {
            try {
                await advancedChat.backupSystem.createFullBackup();
            } catch (error) {
                advancedChat.showToast('خطأ في إنشاء النسخة الاحتياطية');
            }
        });
    }

    if (restoreBackupBtn) {
        restoreBackupBtn.addEventListener('click', function() {
            showRestoreBackupModal();
        });
    }

    if (manageBackupsBtn) {
        manageBackupsBtn.addEventListener('click', function() {
            showBackupManager();
        });
    }

    // الخصوصية
    const menuPrivacy = document.getElementById('menuPrivacy');
    if (menuPrivacy) {
        menuPrivacy.addEventListener('click', function() {
            showPrivacyModal();
        });
    }

    const savePrivacySettings = document.getElementById('savePrivacySettings');
    if (savePrivacySettings) {
        savePrivacySettings.addEventListener('click', function() {
            savePrivacySettingsHandler();
        });
    }
}

function setupEventListeners() {
    // الإرسال بالضغط على Enter
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    if (chatInput && chatSend) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('input', adjustTextareaHeight);
        
        chatInput.addEventListener('click', function() {
            if (!currentUser) {
                document.getElementById('authModal').style.display = 'flex';
            }
        });
    }

    // إعداد أزرار الرد السريع
    setupQuickReplyButtons();

    // أحداث نافذة المصادقة
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const authModalClose = document.getElementById('authModalClose');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForm = document.getElementById('authForm');

    if (authBtn && authModal) {
        authBtn.addEventListener('click', function() {
            authModal.style.display = 'flex';
        });
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }

    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                
                authTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const authNameGroup = document.getElementById('authNameGroup');
                const authSubmitBtn = document.getElementById('authSubmitBtn');
                
                if (tabName === 'register') {
                    if (authNameGroup) authNameGroup.style.display = 'flex';
                    if (authSubmitBtn) authSubmitBtn.textContent = 'إنشاء حساب';
                } else {
                    if (authNameGroup) authNameGroup.style.display = 'none';
                    if (authSubmitBtn) authSubmitBtn.textContent = 'تسجيل الدخول';
                }
            });
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const name = document.getElementById('authName').value;
            const isRegister = document.querySelector('.auth-tab.active').dataset.tab === 'register';
            
            if (isRegister) {
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        
                        return db.collection('users').doc(user.uid).set({
                            uid: user.uid,
                            email: user.email,
                            displayName: name || user.email.split('@')[0],
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    })
                    .then(() => {
                        advancedChat.showToast('تم إنشاء الحساب بنجاح');
                        authModal.style.display = 'none';
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        document.getElementById('authError').textContent = errorMessage;
                    });
            } else {
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        advancedChat.showToast('تم تسجيل الدخول بنجاح');
                        authModal.style.display = 'none';
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        document.getElementById('authError').textContent = errorMessage;
                    });
            }
        });
    }

    // أحداث نافذة الإيموجي
    const chatEmojiBtn = document.getElementById('chatEmojiBtn');
    const emojiModal = document.getElementById('emojiModal');
    const emojiModalClose = document.getElementById('emojiModalClose');

    if (chatEmojiBtn && emojiModal) {
        chatEmojiBtn.addEventListener('click', function() {
            emojiModal.style.display = 'block';
        });
    }

    if (emojiModalClose) {
        emojiModalClose.addEventListener('click', function() {
            emojiModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === emojiModal) {
            emojiModal.style.display = 'none';
        }
    });

    // أحداث نافذة القائمة
    const chatMenuBtn = document.getElementById('chatMenuBtn');
    const menuModal = document.getElementById('menuModal');
    const menuLogout = document.getElementById('menuLogout');

    if (chatMenuBtn && menuModal) {
        chatMenuBtn.addEventListener('click', function() {
            menuModal.style.display = menuModal.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (menuLogout) {
        menuLogout.addEventListener('click', function() {
            menuModal.style.display = 'none';
            auth.signOut().then(() => {
                advancedChat.showToast('تم تسجيل الخروج بنجاح');
            });
        });
    }

    window.addEventListener('click', function(event) {
        if (!event.target.closest('.menu-modal') && !event.target.closest('#chatMenuBtn')) {
            if (menuModal) menuModal.style.display = 'none';
        }
    });

    // زر الإعدادات
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            advancedChat.showToast('صفحة الإعدادات ستكون متاحة قريباً');
        });
    }

    // إغلاق النوافذ بالضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const authModal = document.getElementById('authModal');
            const emojiModal = document.getElementById('emojiModal');
            const menuModal = document.getElementById('menuModal');
            const conversationsSidebar = document.getElementById('conversationsSidebar');
            const adminDashboard = document.getElementById('adminDashboard');
            const whiteboardContainer = document.getElementById('whiteboardContainer');
            const statusModal = document.getElementById('statusModal');
            const privacyModal = document.getElementById('privacyModal');
            
            if (authModal) authModal.style.display = 'none';
            if (emojiModal) emojiModal.style.display = 'none';
            if (menuModal) menuModal.style.display = 'none';
            if (conversationsSidebar) conversationsSidebar.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (whiteboardContainer) whiteboardContainer.style.display = 'none';
            if (statusModal) statusModal.style.display = 'none';
            if (privacyModal) privacyModal.style.display = 'none';
            
            cancelReply();
        }
    });
}

function setupQuickReplyButtons() {
    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const replyText = this.getAttribute('data-reply');
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = `أريد معرفة المزيد عن ${replyText}`;
                adjustTextareaHeight();
                chatInput.focus();
            }
        });
    });
}

function adjustTextareaHeight() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
    }
}

// استبدل وظيفة sendMessage العامة بهذه النسخة
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const messageText = chatInput.value.trim();
    if (!messageText) {
        advancedChat.showToast('يرجى كتابة رسالة');
        return;
    }
    
    if (!currentUser) {
        advancedChat.showToast('يجب تسجيل الدخول أولاً');
        document.getElementById('authModal').style.display = 'flex';
        return;
    }
    
    if (!advancedChat.currentConversation) {
        advancedChat.createConversation('support', 'الدعم الفني').then(conversationId => {
            if (conversationId) {
                advancedChat.switchConversation(conversationId);
                setTimeout(() => {
                    advancedChat.sendMessage(messageText).then(success => {
                        if (success) {
                            chatInput.value = '';
                            adjustTextareaHeight();
                            advancedChat.awardPoints(currentUser.uid, 10, 'لإرسال رسالة');
                            simulateAutoReply(messageText);
                        }
                    });
                }, 500);
            }
        });
    } else {
        advancedChat.sendMessage(messageText).then(success => {
            if (success) {
                chatInput.value = '';
                adjustTextareaHeight();
                advancedChat.awardPoints(currentUser.uid, 10, 'لإرسال رسالة');
                simulateAutoReply(messageText);
            }
        });
    }
}

function simulateAutoReply(userMessage) {
    if (!currentUser) return;

    showTypingIndicator();
    
    let replyText = autoReplies.default;
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("خدم") || lowerMessage.includes("service")) {
        replyText = autoReplies["الخدمات"];
    } else if (lowerMessage.includes("مشروع") || lowerMessage.includes("project")) {
        replyText = autoReplies["المشاريع"];
    } else if (lowerMessage.includes("سعر") || lowerMessage.includes("price") || lowerMessage.includes("تكلفة")) {
        replyText = autoReplies["الأسعار"];
    }
    
    setTimeout(() => {
        hideTypingIndicator();
        
        advancedChat.sendMessage(replyText, 'text', {
            userId: 'system',
            senderName: 'الدعم الفني'
        });
    }, 2000);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const typingEl = document.createElement('div');
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
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
        typingEl.remove();
    }
}

function cancelReply() {
    replyingToMessage = null;
    const replyPreview = document.getElementById('replyPreview');
    if (replyPreview) replyPreview.remove();
}

// =============================================
// واجهات المستخدم الإضافية
// =============================================

function showCreateConversationModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>بدء محادثة جديدة</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="usersList" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                <!-- سيتم ملؤها بالجافاسكريبت -->
            </div>
            <button type="button" class="auth-submit-btn" id="createConversation" style="display: none;">بدء المحادثة</button>
        </div>
    `;

    document.body.appendChild(modal);
    loadUsersList(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showCreateGroupModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>إنشاء مجموعة جديدة</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createGroupForm">
                <div class="auth-form-group">
                    <label for="groupName">اسم المجموعة</label>
                    <input type="text" id="groupName" placeholder="أدخل اسم المجموعة" required>
                </div>
                <div class="auth-form-group">
                    <label for="groupDescription">وصف المجموعة</label>
                    <textarea id="groupDescription" placeholder="وصف المجموعة (اختياري)" rows="3"></textarea>
                </div>
                <div class="auth-form-group">
                    <label for="groupType">نوع المجموعة</label>
                    <select id="groupType">
                        <option value="public">عامة</option>
                        <option value="private">خاصة</option>
                        <option value="channel">قناة</option>
                    </select>
                </div>
                <button type="submit" class="auth-submit-btn">إنشاء المجموعة</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('createGroupForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('groupName').value;
            const description = document.getElementById('groupDescription').value;
            const type = document.getElementById('groupType').value;

            if (advancedChat && typeof advancedChat.createGroup === 'function') {
                await advancedChat.createGroup(name, description, type, {});
                modal.remove();
            } else {
                advancedChat.showToast('وظيفة إنشاء المجموعات غير متاحة حالياً');
            }
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showCreatePollModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>إنشاء استطلاع رأي</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createPollForm">
                <div class="auth-form-group">
                    <label for="pollQuestion">سؤال الاستطلاع</label>
                    <input type="text" id="pollQuestion" placeholder="أدخل سؤال الاستطلاع" required>
                </div>
                <div class="auth-form-group">
                    <label>خيارات الاستطلاع</label>
                    <div id="pollOptions">
                        <input type="text" class="poll-option" placeholder="خيار 1" required>
                        <input type="text" class="poll-option" placeholder="خيار 2" required>
                    </div>
                    <button type="button" id="addOption" style="background: #f0f0f0; border: none; padding: 8px 12px; border-radius: 5px; margin-top: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> إضافة خيار
                    </button>
                </div>
                <button type="submit" class="auth-submit-btn">إنشاء الاستطلاع</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const addOptionBtn = document.getElementById('addOption');
    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', function() {
            const optionsContainer = document.getElementById('pollOptions');
            const optionCount = optionsContainer.children.length + 1;
            const newOption = document.createElement('input');
            newOption.type = 'text';
            newOption.className = 'poll-option';
            newOption.placeholder = `خيار ${optionCount}`;
            newOption.required = true;
            optionsContainer.appendChild(newOption);
        });
    }

    const form = document.getElementById('createPollForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const question = document.getElementById('pollQuestion').value;
            const options = Array.from(document.getElementsByClassName('poll-option'))
                .map(input => input.value)
                .filter(value => value.trim() !== '');

            if (options.length < 2) {
                advancedChat.showToast('يجب إضافة خيارين على الأقل');
                return;
            }

            await sendPollMessage(question, options);
            modal.remove();
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function sendPollMessage(question, options) {
    if (!currentUser || !advancedChat.currentConversation) {
        advancedChat.showToast('يجب تحديد محادثة أولاً');
        return;
    }

    try {
        await advancedChat.sendMessage(
            question,
            'poll',
            {
                question: question,
                options: options.map(option => ({ 
                    text: option, 
                    votes: 0, 
                    voters: [] 
                }))
            }
        );
        
        advancedChat.showToast('تم إنشاء الاستطلاع بنجاح');
        advancedChat.awardPoints(currentUser.uid, 25, 'لإنشاء استطلاع رأي');
    } catch (error) {
        console.error('Error sending poll:', error);
        advancedChat.showToast('خطأ في إنشاء الاستطلاع');
    }
}

function showScheduleMeetingModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>جدولة اجتماع</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="scheduleMeetingForm">
                <div class="auth-form-group">
                    <label for="meetingTitle">عنوان الاجتماع</label>
                    <input type="text" id="meetingTitle" placeholder="أدخل عنوان الاجتماع" required>
                </div>
                <div class="auth-form-group">
                    <label for="meetingDate">تاريخ الاجتماع</label>
                    <input type="datetime-local" id="meetingDate" required>
                </div>
                <div class="auth-form-group">
                    <label for="meetingDuration">مدة الاجتماع (دقائق)</label>
                    <input type="number" id="meetingDuration" value="30" min="15" max="240" required>
                </div>
                <div class="auth-form-group">
                    <label for="meetingDescription">وصف الاجتماع</label>
                    <textarea id="meetingDescription" placeholder="وصف الاجتماع (اختياري)" rows="3"></textarea>
                </div>
                <button type="submit" class="auth-submit-btn">جدولة الاجتماع</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const now = new Date();
    now.setHours(now.getHours() + 1);
    document.getElementById('meetingDate').value = now.toISOString().slice(0, 16);

    const form = document.getElementById('scheduleMeetingForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('meetingTitle').value;
            const date = document.getElementById('meetingDate').value;
            const duration = document.getElementById('meetingDuration').value;
            const description = document.getElementById('meetingDescription').value;

            await advancedChat.sendMessage(
                `📅 اجتماع مجدول: ${title}\n⏰ الوقت: ${new Date(date).toLocaleString('ar-EG')}\n⏳ المدة: ${duration} دقيقة${description ? `\n📝 الوصف: ${description}` : ''}`,
                'system'
            );

            advancedChat.showToast('تم جدولة الاجتماع بنجاح');
            modal.remove();
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
        updateDashboardStats();
        loadAnalyticsChart();
    }
}

async function updateDashboardStats() {
    try {
        const stats = await advancedChat.adminTools.getSystemStats();
        
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalMessages').textContent = stats.totalMessages;
        document.getElementById('activeConversations').textContent = stats.activeConversations;
        document.getElementById('onlineUsers').textContent = stats.onlineUsers;
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

function loadAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    const data = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'الرسائل',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(18, 140, 126, 0.2)',
            borderColor: 'rgba(18, 140, 126, 1)',
            borderWidth: 2,
            tension: 0.4
        }, {
            label: 'المستخدمين',
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: 'rgba(37, 211, 102, 0.2)',
            borderColor: 'rgba(37, 211, 102, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    rtl: true
                },
                title: {
                    display: true,
                    text: 'إحصائيات النظام'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.style.display = 'flex';
        loadFriendStatuses();
    }
}

function loadFriendStatuses() {
    const statusList = document.getElementById('statusList');
    if (!statusList) return;

    statusList.innerHTML = '<div class="loading">جاري تحميل الحالات...</div>';

    setTimeout(() => {
        statusList.innerHTML = '';
        
        // محاكاة حالات الأصدقاء
        const friendStatuses = [
            {
                userInfo: {
                    name: 'محمد أحمد',
                    avatar: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=128C7E&color=fff'
                },
                content: '🌅 صباح الخير!',
                time: '2 ساعة'
            },
            {
                userInfo: {
                    name: 'أحمد التقني',
                    avatar: 'https://ui-avatars.com/api/?name=أحمد+التقني&background=25D366&color=fff'
                },
                content: '💻 أعمل على مشروع جديد',
                time: '5 ساعات'
            }
        ];

        friendStatuses.forEach(status => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            statusItem.innerHTML = `
                <div class="status-avatar">
                    <img src="${status.userInfo.avatar}" alt="${status.userInfo.name}">
                </div>
                <div class="status-info">
                    <h4>${status.userInfo.name}</h4>
                    <p>${status.content}</p>
                    <span class="status-time">${status.time}</span>
                </div>
            `;
            statusList.appendChild(statusItem);
        });

        const addStatusBtn = document.getElementById('addStatusBtn');
        if (addStatusBtn) {
            addStatusBtn.addEventListener('click', function() {
                showCreateStatusModal();
            });
        }

        const closeStatus = document.getElementById('closeStatus');
        if (closeStatus) {
            closeStatus.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
    }, 1000);
}

function showCreateStatusModal() {
    const modal = document.getElementById('createStatusModal');
    if (modal) {
        modal.style.display = 'flex';
        
        const closeCreateStatus = document.getElementById('closeCreateStatus');
        if (closeCreateStatus) {
            closeCreateStatus.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        const statusOptions = document.querySelectorAll('.status-option');
        statusOptions.forEach(option => {
            option.addEventListener('click', function() {
                const type = this.dataset.type;
                createStatus(type);
            });
        });
    }
}

function createStatus(type) {
    let content = '';
    
    switch(type) {
        case 'text':
            content = prompt('أدخل نص الحالة:');
            break;
        case 'image':
            content = '🖼️ صورة جديدة';
            break;
        case 'video':
            content = '🎬 فيديو جديد';
            break;
    }

    if (content) {
        advancedChat.statusSystem.postStatus({
            type: type,
            content: content,
            privacy: document.getElementById('statusPrivacy').value
        }).then(() => {
            advancedChat.showToast('تم نشر الحالة بنجاح');
            document.getElementById('createStatusModal').style.display = 'none';
            document.getElementById('statusModal').style.display = 'none';
        });
    }
}

function showBackupManager() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>إدارة النسخ الاحتياطية</h3>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="backup-list" id="backupList">
                <!-- سيتم ملؤها بالجافاسكريبت -->
            </div>
            <div class="backup-actions">
                <button class="btn-primary" id="createNewBackup">إنشاء نسخة جديدة</button>
                <button class="btn-outline" id="autoBackupToggle">تفعيل النسخ التلقائي</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadBackupList(modal);

    const createNewBackup = document.getElementById('createNewBackup');
    if (createNewBackup) {
        createNewBackup.addEventListener('click', async function() {
            try {
                await advancedChat.backupSystem.createFullBackup();
                loadBackupList(modal);
            } catch (error) {
                advancedChat.showToast('خطأ في إنشاء النسخة الاحتياطية');
            }
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadBackupList(modal) {
    const backupList = modal.querySelector('#backupList');
    if (!backupList) return;

    const backups = advancedChat.backupSystem.getAvailableBackups();
    
    if (backups.length === 0) {
        backupList.innerHTML = '<div class="empty-state">لا توجد نسخ احتياطية</div>';
        return;
    }

    backupList.innerHTML = '';
    backups.forEach(backup => {
        const backupItem = document.createElement('div');
        backupItem.className = 'backup-item';
        backupItem.innerHTML = `
            <div class="backup-info">
                <h4>نسخة احتياطية ${new Date(backup.timestamp).toLocaleString('ar-EG')}</h4>
                <p>${backup.conversations.length} محادثة • ${backup.messages.length} رسالة</p>
            </div>
            <div class="backup-actions">
                <button class="btn-outline restore-btn" data-id="${backup.id}">استعادة</button>
                <button class="btn-outline delete-btn" data-id="${backup.id}">حذف</button>
            </div>
        `;
        backupList.appendChild(backupItem);
    });

    // إضافة مستمعي الأحداث للأزرار
    modal.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const backupId = this.dataset.id;
            try {
                await advancedChat.backupSystem.restoreFromBackup(backupId);
                modal.remove();
            } catch (error) {
                advancedChat.showToast('خطأ في استعادة النسخة الاحتياطية');
            }
        });
    });

    modal.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const backupId = this.dataset.id;
            localStorage.removeItem(`backup_${backupId}`);
            loadBackupList(modal);
            advancedChat.showToast('تم حذف النسخة الاحتياطية');
        });
    });
}

function showRestoreBackupModal() {
    showBackupManager();
}

function showPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'flex';
        
        const closePrivacy = document.getElementById('closePrivacy');
        if (closePrivacy) {
            closePrivacy.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
    }
}

function savePrivacySettingsHandler() {
    const lastSeen = document.getElementById('lastSeenPrivacy').value;
    const profilePicture = document.getElementById('profilePicturePrivacy').value;
    const status = document.getElementById('statusPrivacySetting').value;
    const readReceipts = document.getElementById('readReceipts').checked;

    const privacySettings = {
        lastSeen: lastSeen,
        profilePicture: profilePicture,
        status: status,
        readReceipts: readReceipts
    };

    advancedChat.securitySystem.updatePrivacySettings(privacySettings)
        .then(() => {
            advancedChat.showToast('تم حفظ إعدادات الخصوصية');
            document.getElementById('privacyModal').style.display = 'none';
        })
        .catch(error => {
            advancedChat.showToast('خطأ في حفظ الإعدادات');
        });
}

function setupVoiceRecorder() {
    const voiceRecordBtn = document.getElementById('voiceRecordBtn');
    const voiceRecorder = document.getElementById('voiceRecorder');
    const voiceSend = document.getElementById('voiceSend');
    const voiceCancel = document.getElementById('voiceCancel');
    const voiceTimer = document.querySelector('.voice-timer');

    if (!voiceRecordBtn || !voiceRecorder) return;

    let mediaRecorder = null;
    let audioChunks = [];
    let recordingTimer = null;
    let seconds = 0;

    voiceRecordBtn.addEventListener('mousedown', startRecording);
    voiceRecordBtn.addEventListener('touchstart', startRecording);

    voiceRecordBtn.addEventListener('mouseup', stopRecording);
    voiceRecordBtn.addEventListener('touchend', stopRecording);

    voiceSend.addEventListener('click', sendRecording);
    voiceCancel.addEventListener('click', cancelRecording);

    function startRecording(e) {
        e.preventDefault();
        
        if (!currentUser) {
            advancedChat.showToast('يجب تسجيل الدخول أولاً');
            return;
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.start();
                    voiceRecorder.style.display = 'block';
                    startTimer();

                    // إيقاف التسجيل بعد 2 دقيقة كحد أقصى
                    setTimeout(() => {
                        if (mediaRecorder && mediaRecorder.state === 'recording') {
                            stopRecording();
                        }
                    }, 120000);
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                    advancedChat.showToast('خطأ في الوصول للميكروفون');
                });
        } else {
            advancedChat.showToast('المتصفح لا يدعم التسجيل الصوتي');
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            stopTimer();
        }
    }

    function sendRecording() {
        if (audioChunks.length === 0) {
            advancedChat.showToast('لا يوجد تسجيل صوتي');
            return;
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const duration = seconds;

        if (advancedChat.advancedMedia && advancedChat.currentConversation) {
            advancedChat.advancedMedia.sendVoiceMessage(advancedChat.currentConversation, audioBlob, duration)
                .then(() => {
                    advancedChat.showToast('تم إرسال التسجيل الصوتي');
                    voiceRecorder.style.display = 'none';
                    resetRecorder();
                })
                .catch(error => {
                    console.error('Error sending voice message:', error);
                    advancedChat.showToast('خطأ في إرسال التسجيل');
                });
        }
    }

    function cancelRecording() {
        voiceRecorder.style.display = 'none';
        resetRecorder();
    }

    function startTimer() {
        seconds = 0;
        recordingTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (voiceTimer) {
                voiceTimer.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    function stopTimer() {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
    }

    function resetRecorder() {
        audioChunks = [];
        seconds = 0;
        if (voiceTimer) {
            voiceTimer.textContent = '00:00';
        }
        if (mediaRecorder) {
            mediaRecorder = null;
        }
    }
}

// وظائف مساعدة للتحميل
function downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    advancedChat.showToast('جاري تحميل الملف...');
}

function voteOnPoll(pollId, optionIndex) {
    if (!currentUser) {
        advancedChat.showToast('يجب تسجيل الدخول للتصويت');
        return;
    }

    advancedChat.showToast('تم التصويت على الاستطلاع');
}

// =============================================
// تحسينات إضافية على النظام
// =============================================

// نظام الإشعارات المتقدم
class NotificationSystem {
    constructor() {
        this.permission = null;
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
    }

    showNotification(title, options = {}) {
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icon.png',
                badge: '/badge.png',
                ...options
            });

            notification.onclick = function() {
                window.focus();
                notification.close();
            };

            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }

    showLocalNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'local-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// تهيئة الأنظمة الإضافية
const notificationSystem = new NotificationSystem();

// إضافة رسالة ترحيب من الدعم الفني بعد تحميل الصفحة
setTimeout(() => {
    if (!currentUser) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && !document.querySelector('.system-welcome-message')) {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'message other-message system-welcome-message';
            systemMessage.innerHTML = `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=الدعم+الفني&background=128C7E&color=fff" alt="الدعم الفني">
                </div>
                <div class="message-content">
                    <div class="message-text">مرحباً! أنا مساعدك الافتراضي. كيف يمكنني مساعدتك اليوم؟</div>
                    <div class="message-meta">
                        <span class="message-time">${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(systemMessage);
        }
    }
}, 2000);

// التعامل مع اتصال/انقطاع الإنترنت
window.addEventListener('online', function() {
    advancedChat.showToast('تم استعادة الاتصال بالإنترنت');
    document.getElementById('connectionStatus').innerHTML = '<i class="fas fa-wifi"></i> متصل';
    document.getElementById('connectionStatus').classList.remove('disconnected');
    document.getElementById('connectionStatus').classList.add('connected');
});

window.addEventListener('offline', function() {
    advancedChat.showToast('فقدان الاتصال بالإنترنت');
    document.getElementById('connectionStatus').innerHTML = '<i class="fas fa-wifi"></i> غير متصل';
    document.getElementById('connectionStatus').classList.remove('connected');
    document.getElementById('connectionStatus').classList.add('disconnected');
});

// تحسين تجربة المستخدم على الأجهزة المحمولة
function setupMobileOptimizations() {
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.saveData) {
            console.log('وضع توفير البيانات مفعل');
        }
    }
}

// تهيئة تحسينات الأجهزة المحمولة
setupMobileOptimizations();

// نظام الإحصائيات في الوقت الحقيقي
function setupRealTimeAnalytics() {
    setInterval(async () => {
        if (currentUser) {
            await updateDashboardStats();
        }
    }, 30000);
}

// بدء نظام الإحصائيات
setupRealTimeAnalytics();

// =============================================
// نهاية النظام المتكامل
// =============================================
console.log('نظام الدردشة المتكامل المتقدم جاهز للاستخدام!');