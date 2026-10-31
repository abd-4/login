document.addEventListener('DOMContentLoaded', () => {
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const authForm = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const statUsers = document.getElementById('stat-users');

    // جلب الحسابات المخزنة أو إنشاء مصفوفة جديدة
    function getUsers() {
        return JSON.parse(localStorage.getItem('nutricore_users')) || [];
    }

    function saveUsers(users) {
        localStorage.setItem('nutricore_users', JSON.stringify(users));
    }

    // التحقق من تفعيل خيار "تذكرني" عند فتح التطبيق
    const savedSession = localStorage.getItem('nutricore_active_session');
    if (savedSession) {
        showDashboard();
    }

    // 1. إنشاء حساب جديد
    registerBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('يرجى كتابة البريد الإلكتروني وكلمة المرور أولاً.');
            return;
        }

        const users = getUsers();
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert('هذا الحساب موجود بالفعل! يمكنك تسجيل الدخول مباشرة.');
        } else {
            users.push({ email, password });
            saveUsers(users);
            alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        }
    });

    // 2. تسجيل الدخول
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const users = getUsers();
        const userMatch = users.find(u => u.email === email && u.password === password);

        if (userMatch) {
            // إذا حدد خيار "تذكرني" نحفظ الجلسة
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('nutricore_active_session', email);
            }
            showDashboard();
        } else {
            alert('البريد الإلكتروني أو كلمة المرور غير صحيحة، أو الحساب غير مسجل.');
        }
    });

    // 3. عرض اللوحة الرئيسية وتحديث الإحصائيات
    function showDashboard() {
        authScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');

        // تحديث إحصائية عدد المستخدمين المسجلين
        const users = getUsers();
        statUsers.textContent = users.length;
    }

    // 4. تسجيل الخروج
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('nutricore_active_session');
        dashboardScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
    });
});
