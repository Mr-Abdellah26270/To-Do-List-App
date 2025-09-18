document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterByPriority = document.getElementById('filterByPriority');
    const filterByDueDate = document.getElementById('filterByDueDate');
    const sortBy = document.getElementById('sortBy');
    const sortOrderBtn = document.getElementById('sortOrderBtn');
    const searchInput = document.getElementById('searchInput');
    const languageToggle = document.getElementById('languageToggle');
    const toggleTagsBtn = document.getElementById('toggleTagsBtn');
    const tagsList = document.getElementById('tagsList');
    const filterTabs = document.querySelector('.filters-tabs');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    // Modal elements
    const taskModal = document.getElementById('taskModal');
    const closeButton = taskModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const taskForm = document.getElementById('taskForm');
    const modalTaskInput = document.getElementById('modalTaskInput');
    const modalTaskDescription = document.getElementById('modalTaskDescription');
    const modalPriorityInput = document.getElementById('modalPriorityInput');
    const modalDueDateInput = document.getElementById('modalDueDateInput');
    const modalTagsInput = document.getElementById('modalTagsInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    let tasks = [];
    let currentFilter = 'all';
    let currentPriorityFilter = 'all';
    let currentDueDateFilter = '';
    let currentTagFilter = 'all';
    let currentSortBy = 'addedDate';
    let sortAscending = true;
    let currentSearchTerm = '';
    let editingTaskId = null;
    let currentLanguage = localStorage.getItem('language') || 'ar';
    let currentGrouping = 'none';

    const translations = {
        ar: {
            appTitle: 'قائمة المهام',
            addTaskPlaceholder: 'أضف مهمة جديدة...',
            addTaskBtn: '<i class="fas fa-plus"></i> إضافة مهمة جديدة',
            priorityLow: 'أولوية منخفضة',
            priorityMedium: 'أولوية متوسطة',
            priorityHigh: 'أولوية عالية',
            searchPlaceholder: 'ابحث عن مهمة...',
            allFilter: '<i class="fas fa-list"></i> كل المهام',
            todayFilter: '<i class="fas fa-calendar-day"></i> اليوم',
            upcomingFilter: '<i class="fas fa-calendar-alt"></i> القادمة',
            completedFilter: '<i class="fas fa-check-circle"></i> المهام المنجزة',
            deferredFilter: '<i class="fas fa-clock"></i> المهام المؤجلة',
            overdueFilter: '<i class="fas fa-exclamation-circle"></i> المتأخرة',
            allPriorities: 'كل الأولويات',
            lowPriority: 'منخفضة',
            mediumPriority: 'متوسطة',
            highPriority: 'عالية',
            sortBy: 'ترتيب حسب:',
            sortByAddedDate: 'تاريخ الإضافة',
            sortByDueDate: 'تاريخ الاستحقاق',
            sortByPriority: 'الأولوية',
            sortAscending: 'تصاعدي',
            sortDescending: 'تنازلي',
            editBtn: 'تعديل',
            deleteBtn: 'حذف',
            editTaskPrompt: 'تعديل المهمة:',
            enterTaskTextAlert: 'الرجاء إدخال نص للمهمة.',
            languageToggle: 'English',
            priority: 'الأولوية',
            dueDate: 'تاريخ الاستحقاق',
            modalAddTitle: 'إضافة مهمة جديدة',
            modalEditTitle: 'تعديل المهمة',
            modalTaskLabel: 'المهمة:',
            modalDescriptionLabel: 'الوصف (اختياري):',
            modalPriorityLabel: 'الأولوية:',
            modalDueDateLabel: 'تاريخ الاستحقاق:',
            saveBtn: 'حفظ',
            cancelBtn: 'إلغاء',
            confirmDeleteTask: 'هل أنت متأكد أنك تريد حذف هذه المهمة؟',
            tagsTitle: 'الوسوم / فلاتر سريعة',
            tagPersonal: 'شخصي',
            tagWork: 'عمل',
            tagStudy: 'دراسة',
            tagShopping: 'تسوق 🛒',
            tagHome: 'المنزل 🏠',
            tagFamily: 'العائلة 👨‍👩‍👧‍👦',
            tagHealth: 'الصحة 🏋️‍♂️ / 🩺',
            tagAppointments: 'المواعيد ⏰',
            tagFinancial: 'مالية 💰',
            tagTravel: 'السفر ✈️',
            tagUrgent: 'عاجل ⚡',
            tagImportant: 'مهم ⭐',
            tagLater: 'لاحقاً ⏳',
            tagReading: 'قراءة 📚',
            tagProjects: 'مشاريع 🚀',
            tagLearnSkill: 'تعلم مهارة 🎓',
            tagSports: 'رياضة ⚽',
            tagCooking: 'طبخ 🍳',
            tagGames: 'ألعاب 🎮',
            tagArts: 'فنون 🎨',
            tagMusic: 'موسيقى 🎵',
            tagFriends: 'أصدقاء 🤝',
            tagEvents: 'مناسبات 🎉',
            tagVolunteering: 'تطوع 🤲',
            tagContact: 'تواصل 📞'
        },
        en: {
            appTitle: 'To-Do List',
            addTaskPlaceholder: 'Add a new task...',
            tagsTitle: 'Tags / Quick Filters',
            tagPersonal: 'Personal',
            tagWork: 'Work',
            tagStudy: 'Study',
            tagShopping: 'Shopping 🛒',
            tagHome: 'Home 🏠',
            tagFamily: 'Family 👨‍👩‍👧‍👦',
            tagHealth: 'Health 🏋️‍♂️ / 🩺',
            tagAppointments: 'Appointments ⏰',
            tagFinancial: 'Financial 💰',
            tagTravel: 'Travel ✈️',
            tagUrgent: 'Urgent ⚡',
            tagImportant: 'Important ⭐',
            tagLater: 'Later ⏳',
            tagReading: 'Reading 📚',
            tagProjects: 'Projects 🚀',
            tagLearnSkill: 'Learn Skill 🎓',
            tagSports: 'Sports ⚽',
            tagCooking: 'Cooking 🍳',
            tagGames: 'Games 🎮',
            tagArts: 'Arts 🎨',
            tagMusic: 'Music 🎵',
            tagFriends: 'Friends 🤝',
            tagEvents: 'Events 🎉',
            tagVolunteering: 'Volunteering 🤲',
            tagContact: 'Contact 📞',
            addTaskBtn: '<i class="fas fa-plus"></i> Add New Task',
            priorityLow: 'Low Priority',
            priorityMedium: 'Medium Priority',
            priorityHigh: 'High Priority',
            searchPlaceholder: 'Search for a task...',
            allFilter: '<i class="fas fa-list"></i> All Tasks',
            todayFilter: '<i class="fas fa-calendar-day"></i> Today',
            upcomingFilter: '<i class="fas fa-calendar-alt"></i> Upcoming',
            completedFilter: '<i class="fas fa-check-circle"></i> Completed',
            deferredFilter: '<i class="fas fa-clock"></i> Deferred',
            overdueFilter: '<i class="fas fa-exclamation-circle"></i> Overdue',
            allPriorities: 'All Priorities',
            lowPriority: 'Low',
            mediumPriority: 'Medium',
            highPriority: 'High',
            sortBy: 'Sort by:',
            sortByAddedDate: 'Added Date',
            sortByDueDate: 'Due Date',
            sortByPriority: 'Priority',
            sortAscending: 'Ascending',
            sortDescending: 'Descending',
            editBtn: 'Edit',
            deleteBtn: 'Delete',
            editTaskPrompt: 'Edit task:',
            enterTaskTextAlert: 'Please enter a task.',
            languageToggle: 'العربية',
            priority: 'Priority',
            dueDate: 'Due Date',
            modalAddTitle: 'Add New Task',
            modalEditTitle: 'Edit Task',
            modalTaskLabel: 'Task:',
            modalDescriptionLabel: 'Description (optional):',
            modalPriorityLabel: 'Priority:',
            modalDueDateLabel: 'Due Date:',
            saveBtn: 'Save',
            cancelBtn: 'Cancel',
            confirmDeleteTask: 'Are you sure you want to delete this task?'
        }
    };

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        const html = document.documentElement;
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelector('.navbar .logo h1').textContent = translations[lang].appTitle;
        addTaskBtn.innerHTML = translations[lang].addTaskBtn;
        searchInput.placeholder = translations[lang].searchPlaceholder;

        document.querySelector('[data-filter="all"]').innerHTML = `${translations[lang].allFilter} <span class="task-count">${tasks.length}</span>`;
        document.querySelector('[data-filter="today"]').innerHTML = `${translations[lang].todayFilter} <span class="task-count">${getTaskCount('today')}</span>`;
        document.querySelector('[data-filter="upcoming"]').innerHTML = `${translations[lang].upcomingFilter} <span class="task-count">${getTaskCount('upcoming')}</span>`;
        document.querySelector('[data-filter="completed"]').innerHTML = `${translations[lang].completedFilter} <span class="task-count">${getTaskCount('completed')}</span>`;
        document.querySelector('[data-filter="deferred"]').innerHTML = `${translations[lang].deferredFilter} <span class="task-count">${getTaskCount('deferred')}</span>`;
        document.querySelector('[data-filter="overdue"]').innerHTML = `${translations[lang].overdueFilter} <span class="task-count">${getTaskCount('overdue')}</span>`;

        document.getElementById('tagsTitle').textContent = translations[lang].tagsTitle;
        document.getElementById('tagPersonal').textContent = translations[lang].tagPersonal;
        document.getElementById('tagWork').textContent = translations[lang].tagWork;
        document.getElementById('tagStudy').textContent = translations[lang].tagStudy;
        document.getElementById('tagShopping').textContent = translations[lang].tagShopping;
        document.getElementById('tagHome').textContent = translations[lang].tagHome;
        document.getElementById('tagFamily').textContent = translations[lang].tagFamily;
        document.getElementById('tagHealth').textContent = translations[lang].tagHealth;
        document.getElementById('tagAppointments').textContent = translations[lang].tagAppointments;
        document.getElementById('tagFinancial').textContent = translations[lang].tagFinancial;
        document.getElementById('tagTravel').textContent = translations[lang].tagTravel;
        document.getElementById('tagUrgent').textContent = translations[lang].tagUrgent;
        document.getElementById('tagImportant').textContent = translations[lang].tagImportant;
        document.getElementById('tagLater').textContent = translations[lang].tagLater;
        document.getElementById('tagReading').textContent = translations[lang].tagReading;
        document.getElementById('tagProjects').textContent = translations[lang].tagProjects;
        document.getElementById('tagLearnSkill').textContent = translations[lang].tagLearnSkill;
        document.getElementById('tagSports').textContent = translations[lang].tagSports;
        document.getElementById('tagCooking').textContent = translations[lang].tagCooking;
        document.getElementById('tagGames').textContent = translations[lang].tagGames;
        document.getElementById('tagArts').textContent = translations[lang].tagArts;
        document.getElementById('tagMusic').textContent = translations[lang].music;
        document.getElementById('tagFriends').textContent = translations[lang].tagFriends;
        document.getElementById('tagEvents').textContent = translations[lang].tagEvents;
        document.getElementById('tagVolunteering').textContent = translations[lang].tagVolunteering;
        document.getElementById('tagContact').textContent = translations[lang].tagContact;

        filterByPriority.options[0].textContent = translations[lang].allPriorities;
        filterByPriority.options[1].textContent = translations[lang].lowPriority;
        filterByPriority.options[2].textContent = translations[lang].mediumPriority;
        filterByPriority.options[3].textContent = translations[lang].highPriority;
        document.querySelector('label[for="sortBy"]').textContent = translations[lang].sortBy;
        sortBy.options[0].textContent = translations[lang].sortByAddedDate;
        sortBy.options[1].textContent = translations[lang].sortByDueDate;
        sortBy.options[2].textContent = translations[lang].sortByPriority;
        sortOrderBtn.textContent = sortAscending ? translations[lang].sortAscending : translations[lang].sortDescending;
        languageToggle.textContent = translations[lang].languageToggle;

        modalTitle.textContent = editingTaskId ? translations[lang].modalEditTitle : translations[lang].modalAddTitle;
        document.querySelector('label[for="modalTaskInput"]').textContent = translations[lang].modalTaskLabel;
        document.querySelector('label[for="modalTaskDescription"]').textContent = translations[lang].modalDescriptionLabel;
        modalTaskInput.placeholder = translations[lang].addTaskPlaceholder;
        modalTaskDescription.setAttribute('placeholder', translations[lang].modalDescriptionLabel);
        document.querySelector('label[for="modalPriorityInput"]').textContent = translations[lang].modalPriorityLabel;
        modalPriorityInput.options[0].textContent = translations[lang].priorityLow;
        modalPriorityInput.options[1].textContent = translations[lang].priorityMedium;
        modalPriorityInput.options[2].textContent = translations[lang].priorityHigh;
        document.querySelector('label[for="modalDueDateInput"]').textContent = translations[lang].modalDueDateLabel;
        saveTaskBtn.textContent = translations[lang].saveBtn;
        cancelTaskBtn.textContent = translations[lang].cancelBtn;

        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('todoTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    }

    function getTaskCount(filter) {
        const today = new Date().setHours(0, 0, 0, 0);
        switch (filter) {
            case 'all':
                return tasks.length;
            case 'completed':
                return tasks.filter(task => task.completed).length;
            case 'deferred':
                return tasks.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) > today).length;
            case 'today':
                return tasks.filter(task => {
                    if (!task.dueDate) return false;
                    const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
                    return dueDate === today;
                }).length;
            case 'upcoming':
                return tasks.filter(task => {
                    if (!task.dueDate) return false;
                    const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
                    return dueDate > today;
                }).length;
            case 'overdue':
                return tasks.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) < today).length;
            default:
                return 0;
        }
    }

    function updateTaskCounts() {
        document.querySelector('[data-filter="all"] .task-count').textContent = getTaskCount('all');
        document.querySelector('[data-filter="completed"] .task-count').textContent = getTaskCount('completed');
        document.querySelector('[data-filter="deferred"] .task-count').textContent = getTaskCount('deferred');
        document.querySelector('[data-filter="today"] .task-count').textContent = getTaskCount('today');
        document.querySelector('[data-filter="upcoming"] .task-count').textContent = getTaskCount('upcoming');
        document.querySelector('[data-filter="overdue"] .task-count').textContent = getTaskCount('overdue');

        const completedTasks = getTaskCount('completed');
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let filteredAndSortedTasks = tasks.filter(task => {
            const today = new Date().setHours(0, 0, 0, 0);
            const dueDate = task.dueDate ? new Date(task.dueDate).setHours(0, 0, 0, 0) : null;

            switch (currentFilter) {
                case 'completed':
                    return task.completed;
                case 'deferred':
                    return !task.completed && dueDate && dueDate > today;
                case 'today':
                    return dueDate === today;
                case 'upcoming':
                    return dueDate && dueDate > today;
                case 'overdue':
                    return !task.completed && dueDate && dueDate < today;
                case 'all':
                default:
                    return true;
            }
        }).filter(task => {
            if (currentPriorityFilter === 'all') return true;
            return task.priority === currentPriorityFilter;
        }).filter(task => {
            if (!currentDueDateFilter) return true;
            return task.dueDate === currentDueDateFilter;
        }).filter(task => {
            if (!currentSearchTerm) return true;
            return task.text.toLowerCase().includes(currentSearchTerm.toLowerCase());
        }).filter(task => {
            if (currentTagFilter === 'all') return true;
            return task.tags && task.tags.includes(currentTagFilter);
        });

        filteredAndSortedTasks.sort((a, b) => {
            let comparison = 0;
            if (currentSortBy === 'addedDate') {
                comparison = new Date(a.addedDate) - new Date(b.addedDate);
            } else if (currentSortBy === 'dueDate') {
                if (!a.dueDate && !b.dueDate) comparison = 0;
                else if (!a.dueDate) comparison = 1;
                else if (!b.dueDate) comparison = -1;
                else comparison = new Date(a.dueDate) - new Date(b.dueDate);
            } else if (currentSortBy === 'priority') {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return sortAscending ? comparison : -comparison;
        });

        filteredAndSortedTasks.forEach(task => {
            const listItem = document.createElement('li');
            const today = new Date().setHours(0, 0, 0, 0);
            const dueDate = task.dueDate ? new Date(task.dueDate).setHours(0, 0, 0, 0) : null;

            listItem.className = 'task-item';
            if (task.completed) {
                listItem.classList.add('completed');
            } else if (dueDate && dueDate < today) {
                listItem.classList.add('overdue');
            } else if (dueDate && dueDate > today) {
                listItem.classList.add('deferred');
            } else if (dueDate === today) {
                listItem.classList.add('today');
            }

            listItem.dataset.id = task.id;
            listItem.draggable = true;

            const dueDateText = task.dueDate ? ` | ${translations[currentLanguage].dueDate}: ${task.dueDate}` : '';
            const priorityText = task.priority ? ` | ${translations[currentLanguage].priority}: ${translations[currentLanguage][task.priority + 'Priority']}` : '';

            const tagsHTML = task.tags && task.tags.length > 0
                ? `<div class="task-tags-display">${task.tags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>`
                : '';

            listItem.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <span class="task-meta">${priorityText}${dueDateText}</span>
                    ${tagsHTML}
                </div>
                <div class="actions">
                    <button class="edit-btn">${translations[currentLanguage].editBtn}</button>
                    <button class="delete-btn">${translations[currentLanguage].deleteBtn}</button>
                </div>
            `;

            taskList.appendChild(listItem);
        });
        updateTaskCounts();
    }

    let lastFocusedElement = null;

    function openModal(task = null) {
        lastFocusedElement = document.activeElement;
        taskModal.classList.add('show');
        if (task) {
            editingTaskId = task.id;
            modalTitle.textContent = translations[currentLanguage].modalEditTitle;
            modalTaskInput.value = task.text;
            modalTaskDescription.value = task.description || '';
            modalPriorityInput.value = task.priority;
            modalDueDateInput.value = task.dueDate;
            modalTagsInput.value = task.tags ? task.tags.join(', ') : '';
        } else {
            editingTaskId = null;
            modalTitle.textContent = translations[currentLanguage].modalAddTitle;
            taskForm.reset();
            modalPriorityInput.value = 'medium';
        }
        modalTaskInput.focus();
    }

    function closeModal() {
        taskModal.classList.remove('show');
        editingTaskId = null;
        taskForm.reset();
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    function addOrUpdateTask() {
        const taskText = modalTaskInput.value.trim();
        const taskDescription = modalTaskDescription.value.trim();
        const priority = modalPriorityInput.value;
        const dueDate = modalDueDateInput.value;
        const tags = modalTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const formError = document.getElementById('formError');
        formError.textContent = '';

        if (taskText === '') {
            formError.textContent = translations[currentLanguage].enterTaskTextAlert;
            return;
        }

        if (editingTaskId) {
            tasks = tasks.map(task =>
                task.id === editingTaskId
                    ? { ...task, text: taskText, description: taskDescription, priority: priority, dueDate: dueDate, tags: tags }
                    : task
            );
        } else {
            const newTask = {
                id: Date.now().toString(),
                text: taskText,
                description: taskDescription,
                completed: false,
                priority: priority,
                dueDate: dueDate,
                tags: tags,
                addedDate: new Date().toISOString()
            };
            tasks.push(newTask);
        }
        saveTasks();
        renderTasks();
        closeModal();
    }

    function deleteTask(id) {
        if (confirm(translations[currentLanguage].confirmDeleteTask)) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    function toggleTaskCompletion(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    addTaskBtn.addEventListener('click', (e) => { createRipple(e); openModal(); });

    closeButton.addEventListener('click', (e) => { createRipple(e); closeModal(); });
    cancelTaskBtn.addEventListener('click', (e) => { createRipple(e); closeModal(); });
    window.addEventListener('click', (e) => {
        if (e.target === taskModal && taskModal.classList.contains('show')) {
            closeModal();
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addOrUpdateTask();
    });

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('.task-item');
        if (!listItem) return;

        const taskId = listItem.dataset.id;
        const task = tasks.find(t => t.id === taskId);

        if (e.target.type === 'checkbox') {
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            createRipple(e); // Add ripple to delete button
            deleteTask(taskId);
        } else if (e.target.classList.contains('edit-btn')) {
            createRipple(e); // Add ripple to edit button
            openModal(task);
        }
    });

    let dragSrcEl = null;

    taskList.addEventListener('dragstart', (e) => {
        dragSrcEl = e.target.closest('.task-item');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', dragSrcEl.innerHTML);
        dragSrcEl.classList.add('dragging');
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetItem = e.target.closest('.task-item');
        if (targetItem && targetItem !== dragSrcEl) {
            const bounding = targetItem.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            if (e.clientY > offset) {
                taskList.insertBefore(dragSrcEl, targetItem.nextSibling);
            } else {
                taskList.insertBefore(dragSrcEl, targetItem);
            }
        }
    });

    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragSrcEl !== e.target.closest('.task-item')) {
            const newOrderIds = Array.from(taskList.children).map(item => item.dataset.id);
            const reorderedTasks = newOrderIds.map(id => tasks.find(task => task.id === id));
            tasks = reorderedTasks;
            saveTasks();
            renderTasks();
        }
    });

    taskList.addEventListener('dragend', () => {
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem) {
            draggingItem.classList.remove('dragging');
        }
        dragSrcEl = null;
    });

    filterTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.filter-tab');
        if (target) {
            createRipple(e); // Add ripple to filter tabs
            currentFilter = target.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
            target.classList.add('active');
            renderTasks();
        }
    });

    const tagLinks = document.querySelectorAll('.tags-filters a');

    function updateTagFilterActiveState(activeTag) {
        tagLinks.forEach(link => {
            if (link.dataset.tag === activeTag) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.getBoundingClientRect().left + radius)}px`;
        circle.style.top = `${event.clientY - (button.getBoundingClientRect().top + radius)}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    tagLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            createRipple(e); // Add ripple effect
            const clickedTag = link.dataset.tag;
            if (currentTagFilter === clickedTag) {
                currentTagFilter = 'all';
                updateTagFilterActiveState(null);
            } else {
                currentTagFilter = clickedTag;
                updateTagFilterActiveState(clickedTag);
            }
            renderTasks();
        });
    });

    filterByPriority.addEventListener('change', () => {
        currentPriorityFilter = filterByPriority.value;
        renderTasks();
    });

    filterByDueDate.addEventListener('change', () => {
        currentDueDateFilter = filterByDueDate.value;
        renderTasks();
    });

    sortBy.addEventListener('change', () => {
        currentSortBy = sortBy.value;
        renderTasks();
    });

    const groupBy = document.getElementById('groupBy');

    groupBy.addEventListener('change', () => {
        currentGrouping = groupBy.value;
        renderTasks();
    });

    sortOrderBtn.addEventListener('click', (e) => {
        createRipple(e); // Add ripple to sort order button
        sortAscending = !sortAscending;
        sortOrderBtn.textContent = sortAscending ? translations[currentLanguage].sortAscending : translations[currentLanguage].sortDescending;
        renderTasks();
    });

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedSearch = debounce(() => {
        currentSearchTerm = searchInput.value;
        renderTasks();
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    languageToggle.addEventListener('click', (e) => {
        createRipple(e); // Add ripple to language toggle
        const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setDarkMode(isDarkMode) {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    function loadDarkModePreference() {
        const darkModePreference = localStorage.getItem('darkMode');
        if (darkModePreference === 'enabled') {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }

    darkModeToggle.addEventListener('click', (e) => {
        createRipple(e); // Add ripple to dark mode toggle
        setDarkMode(!body.classList.contains('dark-mode'));
    });

    toggleTagsBtn.addEventListener('click', () => {
        const isExpanded = toggleTagsBtn.getAttribute('aria-expanded') === 'true';
        toggleTagsBtn.setAttribute('aria-expanded', !isExpanded);
        tagsList.classList.toggle('collapsed');
    });

    loadTasks();
    loadDarkModePreference();
    setLanguage(currentLanguage);
});