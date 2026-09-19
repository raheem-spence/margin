// imports
import { fetchCourses, fetchCourseDetails, fetchCourseMembers } from "../api/courses.js";
import { fetchCurrentUser } from "../api/users.js";
import { loadNotes, createNote } from "../api/notes.js"
import { formatRelativeTime, delay } from "../utilities.js";

// constanst / URL params / DOM elements
const baseCourseUrl = 'http://127.0.0.1:5500/html/course.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseId = Number(urlParams.get('courseId'));

const currSiteLocation = document.getElementById('site-location-div');

const courses = await fetchCourses();

const courseContainer = document.getElementById('course-container');

const dropdownMenu = document.getElementById('dropdown-menu');
const sidebarDropdownBtn = document.getElementById('sidebar-label');
const sidebarArrow = document.getElementById('sidebar-arrow');
const ulContainer = document.getElementById('course-list');


const userBtn = document.getElementById('user-icon-btn');
const dropdownModal = document.getElementById('dropdown-modal');
const profileArrow = document.getElementById('profile-arrow');

const userDiv = document.getElementById("user-info");
const userIconName = document.getElementById('user-icon-name');
const userInitials = document.getElementById('initials');



// function definitions
async function renderCourseView(courseId) {
    // get course details
    const courseDetails = await fetchCourseDetails(courseId);
    console.log(courseDetails);

    // get course members
    const courseMembers = await fetchCourseMembers(courseId);

    // get course notes
    const courseNotes = await loadNotes(courseId);

    // get current user
    const currentUser = await fetchCurrentUser();

    const membersModal = renderMembersModal(courseMembers, currentUser);
    const notesContainer = renderCourseNotes(courseNotes, courseDetails);


    // dom elements
    const courseHeaderDiv = document.createElement('div');
    const courseInfoDiv = document.createElement('div');
    const courseInviteDiv = document.createElement('div');

    const courseDataDiv = document.createElement('div');
    const membersBtn = document.createElement('button');
    const membersSpan = document.createElement('span');

    const joinCodeBtn = document.createElement('button');
    const joinCodeSpan = document.createElement('span');
    const joinCodeDivider = document.createElement('span');
    const joinCodeText = document.createElement('span');

    

    const courseName = document.createElement('h1');

    const copySvgContainer = document.createElement('div');
    const copySvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" 
                            style="color: var(--muted-foreground);"><rect width="14" height="14" x="8" y="8" rx="2" ry="2">
                            </rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>`



  

    copySvgContainer.innerHTML = copySvgString;


    joinCodeBtn.addEventListener('click', async () => {
        try {
                // copy code to clipboard
                await navigator.clipboard.writeText(courseDetails.joinCode);

                // change the icon
                const checkMarkString = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
                                        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path>
                                        </svg>`;
                copySvgContainer.style.opacity = 0;

                setTimeout(() => {
                    copySvgContainer.innerHTML = checkMarkString;
                    copySvgContainer.style.opacity = 1;
                }, 150);

                setTimeout(() => {
                    copySvgContainer.style.opacity = 0;

                    setTimeout(() => {
                        copySvgContainer.innerHTML = copySvgString;
                        copySvgContainer.style.opacity = 1;
                    }, 150);
                }, 1500);

            } catch (error) {
                console.error('Failed to copy:', error);
            }
       
    });

    
    membersBtn.addEventListener('click', () => {
        membersModal.showModal();
        document.body.style.overflow = 'hidden';
    })


    const memberSvgContainer = document.createElement('div');
    const memberSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users" style="color: var(--muted-foreground);"><circle cx="9" cy="7" r="4">
                            </circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>`;
    memberSvgContainer.innerHTML = memberSvgString;

    joinCodeSpan.textContent = courseDetails.joinCode;
    joinCodeDivider.textContent = "|";
    joinCodeText.textContent = "Join code";

    courseName.textContent = courseDetails.name;
    membersSpan.textContent = `${courseDetails.memberCount} members`;


    // css classes
    courseHeaderDiv.classList.add('course-header-div');
    courseInfoDiv.classList.add('course-info-div');
    courseDataDiv.classList.add('course-data-div');
    courseName.classList.add('course-view-name');
    membersBtn.classList.add('members-btn');

    joinCodeBtn.classList.add('join-code-btn');
    joinCodeDivider.classList.add('join-code-divider');
    joinCodeText.classList.add('join-code-text');
    joinCodeSpan.classList.add('join-code');

    copySvgContainer.classList.add('copy-svg-container');

    


    // append to DOM
    joinCodeBtn.append(joinCodeText, joinCodeDivider, joinCodeSpan, copySvgContainer);
    membersBtn.append(memberSvgContainer, membersSpan);
    courseDataDiv.append(courseName, membersBtn);
    courseInfoDiv.append(courseDataDiv);
    courseInviteDiv.append(joinCodeBtn);
    courseHeaderDiv.append(courseInfoDiv, courseInviteDiv);
    courseContainer.append(courseHeaderDiv, membersModal, notesContainer);
}

function renderCourseNotes(courseNotes, courseDetails) {

    // notes section/container
    const notesContainer = document.createElement('section');

    // notes header
    const notesHeader = document.createElement('div');

    const searchDiv = document.createElement('div');
    const searchSvgContainer = document.createElement('div');
    const searchSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"
                            style="color: var(--muted-foreground); flex-shrink: 0;"><circle cx="11" cy="11" r="8">
                            </circle><path d="m21 21-4.3-4.3"></path>
                            </svg>`;

    const searchBar = document.createElement('input');

    const createNoteBtn = document.createElement('button');

    const createNoteModal = renderCreateNoteModal(courseDetails);

    createNoteBtn.addEventListener('click', () => {
        createNoteModal.showModal();
        document.body.style.overflow = 'hidden';
    })

    const plusSvgContainer = document.createElement('div');
    const plusSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
                            <path d="M5 12h14"></path><path d="M12 5v14"></path>
                            </svg>`;
    plusSvgContainer.innerHTML = plusSvgString;

   
    // notes list heading
    const notesListHeadingDiv = document.createElement('div');
    const noteSectionTitle = document.createElement('span');
    const notesTotal = document.createElement('span');

    noteSectionTitle.textContent = "All Notes";
    notesTotal.textContent = courseDetails.noteCount;

    // notes list
    const noteList = document.createElement('ul');

    for (const note of courseNotes) {
        const noteDiv = document.createElement('div');

        const noteTitleDiv = document.createElement('div');
        const noteTitle = document.createElement('p');
        const noteOwnerDiv = document.createElement('div');
        const noteInitialsDiv = document.createElement('div');
        const noteInitials = document.createElement('span');
        const noteOwner = document.createElement('p');

        const noteTimeDiv = document.createElement('div');
        const clockSvgContainer = document.createElement('div');
        const clockSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" 
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock">
                                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                                </svg>`;
        const noteTime = document.createElement('p');

        notesContainer.classList.add('course-notes-container');

        noteDiv.classList.add('note-div');
        noteTitleDiv.classList.add('note-title-div');
        noteTitle.classList.add('note-title');
        noteOwner.classList.add('note-owner');
        noteTime.classList.add('note-time');
        noteTimeDiv.classList.add('note-time-div');
        noteList.classList.add('note-list');
        noteInitialsDiv.classList.add('note-initials-div');
        noteInitials.classList.add('note-initials');
        noteOwnerDiv.classList.add('note-owner-div');

        noteTitle.textContent = note.title;
        noteOwner.textContent = note.ownerFirstName + " " + note.ownerLastName;
        noteInitials.textContent = note.ownerFirstName[0].toUpperCase() + note.ownerLastName[0].toUpperCase();
        noteTime.textContent = formatRelativeTime(note.updatedAt);

        clockSvgContainer.innerHTML = clockSvgString;

       
        noteTitleDiv.append(noteTitle, noteOwnerDiv);
        noteTimeDiv.append(clockSvgContainer, noteTime);
        noteInitialsDiv.append(noteInitials)
        noteOwnerDiv.append(noteInitialsDiv, noteOwner);
        noteDiv.append(noteTitleDiv, noteTimeDiv);

        noteList.append(noteDiv);
    }

    notesHeader.classList.add('course-notes-header');
    searchDiv.classList.add('search-bar-container');
    searchSvgContainer.classList.add('search-icon');
    createNoteBtn.classList.add('create-note-btn-course');

    notesListHeadingDiv.classList.add('notes-list-heading-div');
    noteSectionTitle.classList.add('notes-section-title');
    notesTotal.classList.add('notes-total');


    searchSvgContainer.innerHTML = searchSvgString;
    createNoteBtn.textContent = "Create note";
    searchBar.placeholder = "Search notes...";

    notesListHeadingDiv.append(noteSectionTitle, notesTotal);

    searchDiv.append(searchSvgContainer, searchBar);
    createNoteBtn.prepend(plusSvgContainer);
    notesHeader.append(searchDiv, createNoteBtn);


    notesContainer.append(notesHeader, notesListHeadingDiv, createNoteModal, noteList);
    return notesContainer;
}

function renderCreateNoteModal(courseDetails) {

    // create note modal
    const createNoteModal = document.createElement('dialog');

    // header div
    const createNoteModalHeader = document.createElement('div');
    const createNoteTitle = document.createElement('h3');
    const createNoteMessage = document.createElement('p');

    createNoteTitle.textContent = "Create a note";
    createNoteMessage.textContent = "Shared instantly with your class.";



    // course/close btn div
    const createModalCloseDiv = document.createElement('div');
    const courseName = document.createElement('span');
   
    const createModalCloseBtn = document.createElement('button');
    const closeBtnString = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;   
    
    createModalCloseBtn.innerHTML = closeBtnString;
    createModalCloseBtn.setAttribute('aria-label', 'Close');

    courseName.textContent = courseDetails.name;
    createModalCloseDiv.append(courseName, createModalCloseBtn);

    // note title div
    const modalNoteTitleDiv = document.createElement('div')
    const modalNoteTitleLabel = document.createElement('label');
    const modalNoteTitleInput = document.createElement('input');

    modalNoteTitleLabel.htmlFor = 'create-note-title';
    modalNoteTitleLabel.textContent = "Note title";

    modalNoteTitleInput.id = 'create-note-title';
    modalNoteTitleInput.placeholder = "Note title...";

    // note content div
    const modalNoteContentDiv = document.createElement('div');
    const modalNoteContentLabel = document.createElement('label');
    const modalNoteContent = document.createElement('textarea');

    modalNoteContentLabel.htmlFor = 'create-note-content';
    modalNoteContentLabel.textContent = 'Note content';

    modalNoteContent.id = 'create-note-content';
    modalNoteContent.placeholder = "Start writing your note...";

    // share button div
    const modalShareBtn = document.createElement('button');
    const shareArrowSvgContainer = document.createElement('div');

    shareArrowSvgContainer.setAttribute('aria-hidden', 'true');

    modalShareBtn.textContent = "Share with class";
    shareArrowSvgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
                                        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right">
                                        <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;

    createNoteModal.classList.add('create-modal');
    createNoteModalHeader.classList.add('create-note-modal-header');
    createNoteTitle.classList.add('create-note-title');
    createNoteMessage.classList.add('create-note-msg');
    createModalCloseBtn.classList.add('modal-close-btn');
    createModalCloseDiv.classList.add('modal-close-div');
    courseName.classList.add('modal-course-badge');

    modalNoteTitleInput.classList.add('modal-note-title');
    modalNoteTitleLabel.classList.add('visually-hidden');
    modalNoteTitleDiv.classList.add('modal-note-title-div');
    modalNoteContentDiv.classList.add('modal-content-div');

    modalNoteContent.classList.add('modal-textarea');
    modalNoteContentLabel.classList.add('visually-hidden');

    modalShareBtn.classList.add('share-btn');

    createModalCloseBtn.addEventListener('click', () => {
        createNoteModal.close();
    })

    createNoteModal.addEventListener('close', () => {
        document.body.style.overflow = '';
    })

    modalShareBtn.append(shareArrowSvgContainer);
    modalNoteTitleDiv.append(modalNoteTitleLabel, modalNoteTitleInput);
    modalNoteContentDiv.append(modalNoteTitleDiv, modalNoteContentLabel, modalNoteContent, modalShareBtn);

    createNoteModalHeader.append(createModalCloseDiv, createNoteTitle, createNoteMessage);
   
    createNoteModal.append(createNoteModalHeader, modalNoteContentDiv);

    modalShareBtn.addEventListener('click', async () => {
        const noteData = {
            title: modalNoteTitleInput.value,
            content: modalNoteContent.value
        }

        modalShareBtn.textContent = "Sharing...";
      
        const result = await Promise.all([
            createNote(courseId, noteData),
            delay(800)
        ]);
        
        
        if (result[0]) {
            modalShareBtn.textContent = "Shared!";
            modalShareBtn.style.backgroundColor = "green";
            await delay(800);
            createNoteModal.close();
        } else {

        }
    
    })

    return createNoteModal;
}

function renderMembersModal(courseMembers, currentUser) {

    // members modal wrapper div
    const membersModalDiv = document.createElement('div');

    // members modal
    const membersModal = document.createElement('dialog');

    // header div
    const membersModalHeader = document.createElement('div');


    // title div
    const membersCloseDiv = document.createElement('div');
    const memberCount = document.createElement('h3');
    const closeBtn = document.createElement('button');
    const closeSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
    closeBtn.innerHTML = closeSvgString;
    
 
    // members container
    const memberContainer = document.createElement('div');

    // build members list
    const memberList = document.createElement('ul');

    for (const member of courseMembers) {
        // create a li tag
        const memberItem = document.createElement('li');

        // div for member avatar
        const memberInitials = document.createElement('div');
        const memberInitialsSpan = document.createElement('span');
        memberInitialsSpan.textContent = member.firstName[0].toUpperCase() + member.lastName[0].toUpperCase();

        // div for name and joined at date
        const memberInfo = document.createElement('div');
        const memberNameDiv = document.createElement('div');
        const memberName = document.createElement('p');
        const joinedDate = document.createElement('span');

        if (currentUser.id === member.id) {
            const currUserSpan = document.createElement('span');
            currUserSpan.textContent = "You";

            currUserSpan.classList.add('current-user-span');

            memberNameDiv.append(memberName, currUserSpan);
        } else {
            memberNameDiv.append(memberName);
        }
        
        memberItem.classList.add('member-item');
        memberInitials.classList.add('member-initials');
        memberInfo.classList.add('member-info-div');
        memberName.classList.add('member-name');
        joinedDate.classList.add('joined-date');
        memberNameDiv.classList.add('member-name-div');

        memberName.textContent = member.firstName + " " + member.lastName;
        joinedDate.textContent = `Joined ${formatJoinedDate(member.joinedAt)}`;

        memberInitials.append(memberInitialsSpan);
        memberInfo.append(memberNameDiv, joinedDate);
        memberItem.append(memberInitials, memberInfo);

        memberList.append(memberItem);
    }

    closeBtn.addEventListener('click', () => {
        membersModal.close();
        document.body.style.overflow = '';
    })

    membersModalDiv.classList.add('members-modal-div');
    membersModal.classList.add('members-modal');
    membersModalHeader.classList.add('modal-header');
    membersCloseDiv.classList.add('modal-close-div');
    closeBtn.classList.add('modal-close-btn');
    memberContainer.classList.add('member-container');

    // members modal 
    memberCount.textContent = `${courseMembers.length} Members`;

    memberContainer.append(memberList);
    membersCloseDiv.append(memberCount, closeBtn);
    membersModalHeader.append(membersCloseDiv);
    membersModalDiv.append(membersModalHeader, memberContainer);
    membersModal.append(membersModalDiv);

    return membersModal;
}


async function renderBreadCrumb(courses, courseId) {
    const currCourse = document.createElement('p');
   
    for (const course of courses) {
        if (course.id === courseId) {
            currCourse.textContent = course.name;
        }
    }

    currCourse.classList.add('current-course');

    currSiteLocation.append(currCourse);
}


function renderSideBarCourses(courses) {
    // clear ul container
    ulContainer.replaceChildren();

    if (courses.length === 0) {
        const emptyMsgSidebarDiv = document.createElement('div');

        emptyMsgSidebarDiv.textContent = "You have no courses yet..."
        emptyMsgSidebarDiv.classList.add('empty-sidebar');
        ulContainer.appendChild(emptyMsgSidebarDiv);
        
    } else {
        const fieldName = "courseId";

        for (const course of courses) {
            const url = new URL(baseCourseUrl);
            const courseLi = document.createElement('li');
            courseLi.classList.add('course');


            const courseATag = document.createElement('a');
            const fieldValue = course.id;
            url.searchParams.set(fieldName, fieldValue);

            courseATag.href = url.toString();

            const courseName = document.createElement('span');
            courseName.classList.add('sidebar-course-name');
            courseName.textContent = course.name;

            courseATag.appendChild(courseName);

            courseLi.appendChild(courseATag);
            ulContainer.appendChild(courseLi);
        }

        dropdownMenu.appendChild(ulContainer);

        const sideBarCourses = document.querySelectorAll('li.course');

    }
}

async function renderUser() {

    const user = await fetchCurrentUser();
    console.log(user);

    const usernamePara = document.createElement('p');
    const userEmailPara = document.createElement('p');

    usernamePara.textContent = user.firstName + " " + user.lastName;
    usernamePara.classList.add("username");

    userEmailPara.textContent = user.email;
    userEmailPara.classList.add("user-email")
    
    userDiv.appendChild(usernamePara);
    userDiv.appendChild(userEmailPara);

    userIconName.textContent = user.firstName + " " + user.lastName[0] + ".";
    userInitials.textContent = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
 
}

function formatJoinedDate(joinedAt) {
    const joinedDate = new Date(joinedAt);

    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }
    return joinedDate.toLocaleDateString('en-US', options);
}


// event listeners 
userBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownModal.classList.toggle('show');

    if (userBtn.classList.contains('white-bg')) {
        userBtn.classList.remove('white-bg');
        userBtn.classList.remove('shadow');
        profileArrow.classList.remove('rotate');
    } else {
        userBtn.classList.add('white-bg');
        userBtn.classList.add('shadow');
        profileArrow.classList.add('rotate');
    }
});

window.addEventListener('click', () => {
    if (dropdownModal.classList.contains('show')) {
        dropdownModal.classList.remove('show')
    }
    
    if (userBtn.classList.contains('white-bg')) {
        userBtn.classList.remove('white-bg');
        userBtn.classList.remove('shadow');
        profileArrow.classList.remove('rotate');
    }
});

sidebarDropdownBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('open');
    sidebarArrow.classList.toggle('rotate');
})


// initial page setup / function calls
// renderBreadCrumb(courses, courseId);
renderSideBarCourses(courses);
renderCourseView(courseId);
renderUser();