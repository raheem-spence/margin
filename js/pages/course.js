// imports
import { fetchCourses, fetchCourseDetails, fetchCourseMembers } from "../api/courses.js";
import { fetchCurrentUser } from "../api/users.js";

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

    // get course members
    const courseMembers = await fetchCourseMembers(courseId);

    // get current user
    const currentUser = await fetchCurrentUser();

    const membersModal = renderMembersModal(courseMembers, currentUser);
    const notesContainer = renderCourseNotes(courseId);

    // // dom elements
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

function renderCourseNotes(courseId) {
    // notes section/container
    const notesContainer = document.createElement('section');

    // notes header
    const notesHeader = document.createElement('div');

    const searchDiv = document.createElement('div');
    const searchSvgContainer = document.createElement('div')
    const searchBar = document.createElement('input');

    const createNoteBtn = document.createElement('button');
    // notes list



    return notesContainer;
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
    })

    membersModalDiv.classList.add('members-modal-div');
    membersModal.classList.add('members-modal');
    membersModalHeader.classList.add('modal-header');
    membersCloseDiv.classList.add('members-close-div');
    closeBtn.classList.add('member-close-btn');
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