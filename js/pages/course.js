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
    // course details
    const courseDetails = await fetchCourseDetails(courseId);

    // course members
    const courseMembers = await fetchCourseMembers(courseId);

    // current user
    const currentUser = await fetchCurrentUser();

    // dom elements
    const courseHeaderDiv = document.createElement('div');
    const courseInfoDiv = document.createElement('div');
    const courseInviteDiv = document.createElement('div');

    const courseDataDiv = document.createElement('div');
    const membersBtn = document.createElement('button');
    const membersSpan = document.createElement('span');

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
    
    // search bar
    const memberSearchBarDiv = document.createElement('div');
    const memberSearchBar = document.createElement('input');
    const searchIconDiv = document.createElement('div');
    const searchSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"
                            style="color: var(--muted-foreground); flex-shrink: 0;"><circle cx="11" cy="11" r="8">
                            </circle><path d="m21 21-4.3-4.3"></path></svg>`;

    
    memberSearchBar.placeholder = "Search members...";
    searchIconDiv.innerHTML = searchSvgString;

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

    const fakeMember = "izuku midoriya";

    for (let i = 0; i < 100; i++) {
        const fakeItem = document.createElement('li');
        fakeItem.append(fakeMember);

        memberList.append(fakeItem);
    }


    const joinCodeBtn = document.createElement('button');
    const joinCodeSpan = document.createElement('span');
    const inviteBtn = document.createElement('button');
    const inviteSpan = document.createElement('span');

    const courseName = document.createElement('h1');

    const copySvgContainer = document.createElement('div');
    const copySvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" 
                            style="color: var(--muted-foreground);"><rect width="14" height="14" x="8" y="8" rx="2" ry="2">
                            </rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>`

    const inviteSvgContainer = document.createElement('div');
    const inviteSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus" 
                            style="color: var(--muted-foreground);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2">
                            </path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line>
                            </svg>`;

    inviteSvgContainer.innerHTML = inviteSvgString;
    inviteSpan.textContent = "Invite";

    copySvgContainer.innerHTML = copySvgString;

    // members modal 
    memberCount.textContent = `${courseDetails.memberCount} Members`;



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

    closeBtn.addEventListener('click', () => {
        membersModal.close();
    })

    const memberSvgContainer = document.createElement('div');
    const memberSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" 
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users" style="color: var(--muted-foreground);"><circle cx="9" cy="7" r="4">
                            </circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>`;
    memberSvgContainer.innerHTML = memberSvgString;

    joinCodeSpan.textContent = courseDetails.joinCode;

    courseName.textContent = courseDetails.name;
    membersSpan.textContent = `${courseDetails.memberCount} members`;


    // css classes
    courseHeaderDiv.classList.add('course-header-div');
    courseInfoDiv.classList.add('course-info-div');
    courseInviteDiv.classList.add('course-invite-div');
    courseDataDiv.classList.add('course-data-div');
    courseName.classList.add('course-view-name');
    membersBtn.classList.add('members-btn');
    joinCodeBtn.classList.add('join-code-btn');
    copySvgContainer.classList.add('copy-svg-container');
    inviteBtn.classList.add('invite-btn');
    membersModalDiv.classList.add('members-modal-div');
    membersModal.classList.add('members-modal');
    membersModalHeader.classList.add('modal-header');
    membersCloseDiv.classList.add('members-close-div');
    memberSearchBarDiv.classList.add('members-search-bar-div');
    memberSearchBar.classList.add('member-search-bar');
    closeBtn.classList.add('member-close-btn');
    memberContainer.classList.add('member-container');


    // append to DOM
    memberContainer.append(memberList);
    membersCloseDiv.append(memberCount, closeBtn);
    memberSearchBarDiv.append(searchIconDiv, memberSearchBar);
    membersModalHeader.append(membersCloseDiv, memberSearchBarDiv);
    membersModalDiv.append(membersModalHeader, memberContainer);
    membersModal.append(membersModalDiv);
    inviteBtn.append(inviteSvgContainer, inviteSpan);
    joinCodeBtn.append(copySvgContainer, joinCodeSpan);
    membersBtn.append(memberSvgContainer, membersSpan);
    courseDataDiv.append(courseName, membersBtn);
    courseInfoDiv.append(courseDataDiv);
    courseInviteDiv.append(joinCodeBtn, inviteBtn);
    courseHeaderDiv.append(courseInfoDiv, courseInviteDiv);
    courseContainer.append(courseHeaderDiv, membersModal);
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
renderBreadCrumb(courses, courseId);
renderSideBarCourses(courses);
renderCourseView(courseId);
renderUser();