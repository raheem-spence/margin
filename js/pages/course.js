import { fetchCourses } from "../api/courses.js";
import { fetchCurrentUser } from "../api/users.js";
import { loadNotes, createNote, updateNote } from "../api/notes.js";

// ---------- Configuration ---------- 
const baseCourseUrl = 'http://127.0.0.1:5500/html/course.html';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseId = urlParams.get('courseId');



// ---------- DOM Elements ---------- 
const courseTitle = document.getElementById('course-title');

const noteContainer = document.getElementById("notes-container");

const ulContainer = document.getElementById('course-list');

const createNoteBtn = document.getElementById("create-note-btn");

const newTitleInput = document.getElementById("note-title-input");

const userDiv = document.getElementById("user-info");

const dashboardDiv = document.getElementById("dashboard-container");

const userBtn = document.getElementById('user-icon-btn');
const dropdownModal = document.getElementById('dropdown-modal');

userBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownModal.classList.toggle('show');
    userBtn.classList.toggle('white-bg');
});

window.addEventListener('click', () => {
    if (dropdownModal.classList.contains('show')) {
        dropdownModal.classList.remove('show')
    }
});



// ---------- App State ---------- 

let currentlyEditingNoteId = null;
renderDashboard()



// ---------- Initialization ---------- 

// Show user courses
const courses = await fetchCourses();
renderCourses(courses);

// Show user notes
await refreshNotes(courseId);

// Show user info
await renderUser();


// ---------- Sidebar ---------- 

// Render sidebar courses
function renderCourses(courses) {
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
            courseName.classList.add('course-name');
            courseName.textContent = course.name;

            courseATag.appendChild(courseName);

            courseLi.appendChild(courseATag);
            ulContainer.appendChild(courseLi);
        }

        const sideBarCourses = document.querySelectorAll('li.course');
        highlightActiveCourse(sideBarCourses);

        const currentCourseName = document.querySelector('.course.active');
        updateHeading(currentCourseName);
    }
}

// Render username and email 
async function renderUser() {

    const user = await fetchCurrentUser();

    const usernamePara = document.createElement('p');
    const userEmailPara = document.createElement('p');

    usernamePara.textContent = user.firstName + " " + user.lastName;
    usernamePara.classList.add("username");

    userEmailPara.textContent = user.email;
    userEmailPara.classList.add("user-email")
    
    userDiv.appendChild(usernamePara);
    userDiv.appendChild(userEmailPara);
}


// ---------- Notes CRUD ---------- 

// CREATE NOTE
// get create note button id
const newTextAreaInput = document.getElementById("note-content-input");

createNoteBtn.addEventListener('click', async () => {
    // read the value property of title input
    const noteTitle = newTitleInput.value.trim();

    // read the value property of textarea
    const noteContent = newTextAreaInput.value.trim();
  
    const isValid = validateInputs(noteTitle, noteContent);

    if (!isValid) {
        alert("Invalid input");
        return
    }
  
    if (currentlyEditingNoteId === null) {
        await handleCreate(noteTitle, noteContent, courseId);
    } else {
        await handleUpdate(noteTitle, noteContent, courseId, currentlyEditingNoteId);
    }

})

// READ NOTES
function renderNotes(notes){
    
    // clear notes container
    noteContainer.replaceChildren();

    if (notes.length === 0){
        const emptyNotesMessage = document.createElement('h4');
        emptyNotesMessage.textContent = "Notes you add appear here"
        emptyNotesMessage.classList.add('empty-note-msg');

        noteContainer.appendChild(emptyNotesMessage);

        return
    } else {

        for (const noteData of notes) {

            const noteCard = document.createElement('article');

            const noteId = noteData.id;
            noteCard.dataset.id = noteId;

            const newTitle = document.createElement('h4');
            newTitle.textContent = noteData.title;

          
            const newElapsedTime = document.createElement('p');
            newElapsedTime.textContent = noteData.createdAt;
            newElapsedTime.classList.add("time-elapsed");

        
            const newContent= document.createElement('p');
            newContent.textContent = noteData.content;
            newContent.classList.add("note-content");

            // create div for edit/delete buttons
            const btnsDiv = document.createElement('div');

            // edit and delete buttons
            const editBtn = document.createElement('button');
            editBtn.classList.add("edit-btn");
        

            const delBtn = document.createElement('button');
            delBtn.classList.add("del-btn");

            const svgNS = "http://www.w3.org/2000/svg"

            // edit svg 
            const svgEditBtnContainer = document.createElementNS(svgNS, 'svg');

            const editPathElement = document.createElementNS(svgNS, 'path');

            svgEditBtnContainer.setAttribute("viewBox", "0 0 24 24");
            svgEditBtnContainer.setAttribute("fill", "none");
            svgEditBtnContainer.setAttribute("stroke-width", "1.5")
            svgEditBtnContainer.setAttribute("stroke", "currentColor");
            svgEditBtnContainer.setAttribute("class", "size-6");

            editPathElement.setAttribute("stroke-linecap", "round");
            editPathElement.setAttribute("stroke-linejoin", "round");
            editPathElement.setAttribute("d", "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10");

            const editSpan = document.createElement('span');
            editSpan.textContent = "Edit";

            svgEditBtnContainer.appendChild(editPathElement);

            editBtn.append(svgEditBtnContainer, editSpan);



            // delete svg
            const svgDelBtnContainer = document.createElementNS(svgNS, 'svg');

            const delPathElement = document.createElementNS(svgNS, 'path');

            svgDelBtnContainer.setAttribute("viewBox", "0 0 24 24");
            svgDelBtnContainer.setAttribute("fill", "none");
            svgDelBtnContainer.setAttribute("stroke-width", "1.5")
            svgDelBtnContainer.setAttribute("stroke", "currentColor");
            svgDelBtnContainer.setAttribute("class", "size-6");

            delPathElement.setAttribute("stroke-linecap", "round");
            delPathElement.setAttribute("stroke-linejoin", "round");
            delPathElement.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");

            const delSpan = document.createElement('span');
            delSpan.textContent = "Delete";

            svgDelBtnContainer.appendChild(delPathElement);

            delBtn.append(svgDelBtnContainer, delSpan);

            btnsDiv.classList.add("edit-delete");

            btnsDiv.append(editBtn, delBtn);

            noteCard.classList.add("note-card")

            // append inner elements to article element
            noteCard.append(newTitle, newElapsedTime, newContent, btnsDiv);

            noteContainer.append(noteCard);
        }
    }
}


// DELETE & EDIT NOTE
noteContainer.addEventListener('click', async (event) => {

    // find the closet button from target
    const btnItem = event.target.closest('button');

    if(!btnItem) {
        return
    }
     
    // find the closest note card from button
    const closestNoteCard = btnItem.closest('.note-card');
    const noteCardId = closestNoteCard.dataset.id;

    // if edit button clicked
    if(btnItem.classList.contains('edit-btn')) {

        currentlyEditingNoteId = noteCardId;
        
        // fill form with old title/content
        const origTitle = closestNoteCard.querySelector('h4');
        const origContentPara = closestNoteCard.querySelector('p.note-content');

        newTitleInput.value = origTitle.textContent;
        newTextAreaInput.value = origContentPara.textContent;

        // change btn text to 'Update Note'
        createNoteBtn.textContent = "Update Note";

        // if delete button clicked
        } else if (btnItem.classList.contains('del-btn')) {

            try {
                const response = await fetch(`http://127.0.0.1:8080/courses/${courseId}/notes/${noteCardId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.status === 403) {
                    console.log('You do not have permission to delete this note.')
                } else if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`)
                } else {
                await refreshNotes(courseId);
                }

            } catch (error) {
                console.log(error);
            }
        }
})

// ---------- Rendering ---------- 

function highlightActiveCourse(sideBarCourses) {
    const currentHref = window.location.href
    sideBarCourses.forEach(course => {
        const currentCourse = course.querySelector("a");
        const href = currentCourse.getAttribute("href");

        if(href == currentHref){
                course.classList.add("active");
        }
    });
}

function updateHeading(currentCourse) {
    courseTitle.textContent = currentCourse.textContent + " Notes";
}

async function refreshNotes(courseId) {
    const notes = await loadNotes(courseId);
    renderNotes(notes);
}

function clearInputs() {
    newTitleInput.value = "";
    newTextAreaInput.value = "";
}


function validateInputs(title, content) {
    // Validate title and content
    if (title.length == 0) {
        return false;
    } else if (content.length == 0) {
        return false;
    }

    return true;
}


async function handleCreate(title, content, courseId) {
    const noteData = {title: title, content: content}

    await createNote(courseId, noteData);
    await refreshNotes(courseId);

    clearInputs();
}

async function handleUpdate(title, content, courseId, noteId) {
    const noteData = {title: title, content: content}

    const canUpdate = await updateNote(courseId, noteData, noteId);

    if (!canUpdate) {
        console.log("You do not have permission to edit this note.");
        clearInputs();
        createNoteBtn.textContent = "Create Note";
        currentlyEditingNoteId = null;
    } else {
        await refreshNotes(courseId);
        clearInputs();
        createNoteBtn.textContent = "Create Note";
        currentlyEditingNoteId = null;
    }
}



async function initializeApp() {

}

function renderDashboard() {
    const welcomeDiv = document.createElement('div');
    const welcomeDivContent = document.createElement('div');
    const dashboardHeading = document.createElement('p');
    const greeting = document.createElement('h1');
    const welcomeMsg = document.createElement('p');

    const dateDiv = document.createElement('div');
    const date = document.createElement('p');
    const today = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};

    welcomeDivContent.classList.add("welcome-div-content");
    welcomeMsg.classList.add("welcome-msg");
    date.classList.add('welcome-date');
    date.textContent = today.toLocaleDateString('en-US', options);
    dashboardHeading.classList.add("dashboard-heading");
    greeting.classList.add('greeting');

    dashboardHeading.textContent = "DASHBOARD";
    greeting.textContent = "Welcome to Margin, Raheem.";
    welcomeMsg.textContent = "Your classes, notes, and classmates all in one place";
    welcomeDiv.classList.add('welcome-div');
    
    
    dateDiv.appendChild(date);
    welcomeDivContent.append(dashboardHeading, greeting, welcomeMsg);
    welcomeDiv.append(welcomeDivContent, dateDiv);
    dashboardDiv.append(welcomeDiv);


}