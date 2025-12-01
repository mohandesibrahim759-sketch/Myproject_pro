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

// نظام إدارة الأخطاء المركزي
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        const errorMessage = this.getUserFriendlyMessage(error);
        this.showErrorNotification(errorMessage);
        
        // تسجيل الخطأ للتحليلات
        this.logError(error, context);
    }
    
    static getUserFriendlyMessage(error) {
        if (error.code) {
            switch (error.code) {
                case 'permission-denied':
                    return 'ليس لديك صلاحية للقيام بهذا الإجراء';
                case 'unavailable':
                    return 'الخدمة غير متاحة حالياً، يرجى المحاولة لاحقاً';
                case 'storage/object-not-found':
                    return 'الملف غير موجود';
                case 'storage/quota-exceeded':
                    return 'تم تجاوز مساحة التخزين المسموح بها';
                default:
                    return error.message || 'حدث خطأ غير متوقع';
            }
        }
        return error.message || 'حدث خطأ غير متوقع';
    }
    
    static showErrorNotification(message) {
        if (window.advancedChat && window.advancedChat.showNotification) {
            window.advancedChat.showNotification('خطأ', message, { type: 'error' });
        } else {
            // Fallback notification
            const toast = document.createElement('div');
            toast.className = 'error-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        }
    }
    
    static logError(error, context) {
        // يمكن إرسال الأخطاء لخدمة تحليلات مثل Sentry
        console.log('Error logged:', { error, context, timestamp: new Date() });
    }
}

// نظام التخزين المؤقت
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.ttl = 5 * 60 * 1000; // 5 دقائق
    }
    
    set(key, value, ttl = this.ttl) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
    
    delete(key) {
        this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
}

// إنشاء نسخة عامة من مدير التخزين المؤقت
const cacheManager = new CacheManager();

// تصدير الكائنات للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        auth, 
        db, 
        storage, 
        database, 
        firebaseConfig,
        ErrorHandler,
        cacheManager
    };
} else {
    window.firebaseConfig = { auth, db, storage, database, ErrorHandler, cacheManager };
}