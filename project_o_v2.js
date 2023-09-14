// Fires when the HTML document has been completely parsed, and all deferred scripts and have downloaded and executed.
document.addEventListener('DOMContentLoaded', function () {
    var resumeForm = document.getElementById('resumeForm');
    var resumeOutput = document.getElementById('resumeOutput');
    var addEducationBtn = document.getElementById('addEducation');
    var addExperienceBtn = document.getElementById('addExperience');
    var addSkillBtn = document.getElementById('addSkill');
    var generateResumeBtn = document.getElementById('generateResume');
    var editResumeBtn = document.getElementById('editResume');
   
    if (!editResumeBtn) {
        editResumeBtn = document.createElement('button');
        editResumeBtn.setAttribute('id', 'editResresumeDataume');
        editResumeBtn.onclick = populateFormWithId;
    }

    var educationCounter = 0;
    var experienceCounter = 0;
    var skillCounter = 0;
    var id = 0;

    // Storing the unique keys in a array that will be used later to get the resume from url
    var datum = JSON.parse(localStorage.getItem('datum')) || [];
    console.log(datum);

    var resumeData = {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        education: [],
        experience: [],
        skills: [],
    };

    // URLSearchParams -> Provides a way to get the data(url parameters) from the URL (e.g. everything after " ? ").
    var url = new URLSearchParams(window.location.search);
    // url.get() -> Returns the first value associated with the given search parameter.
    var resumeId = url.get('id');

    if (resumeId) {
        // datum = JSON.parse(localStorage.getItem('datum'));
        resumeData = datum.find(obj => obj.id == resumeId);
        console.log(resumeData);
        // updateResumeOutput();
        editResumeBtn.classList.remove('hidden');
    }
    else {
        editResumeBtn.classList.add('hidden');
    }

    updateResumeOutput();

    editResumeBtn.addEventListener('click', function () {
        // Fill the form with data from localStorage
        editResumeBtn.style = 'background-color: red';

        console.log('enter');
        // Fill the form with data from resumeData
        document.getElementById('name').value = resumeData.name;
        document.getElementById('email').value = resumeData.email;
        document.getElementById('phone').value = resumeData.phone;
        document.getElementById('address').value = resumeData.address;

        // Fill educational background
        for (var i = 1; i <= resumeData.education.length; i++) {
            document.getElementById('addEducation').click();
            document.getElementById(`university${i}`).value = resumeData.education[i - 1].university;
            document.getElementById(`degree${i}`).value = resumeData.education[i - 1].degree;
            document.getElementById(`gradYear${i}`).value = resumeData.education[i - 1].gradYear;
        }

        // Fill work experience
        for (var i = 1; i <= resumeData.experience.length; i++) {
            document.getElementById('addExperience').click();
            document.getElementById(`company${i}`).value = resumeData.experience[i - 1].company;
            document.getElementById(`position${i}`).value = resumeData.experience[i - 1].position;
            document.getElementById(`duration${i}`).value = resumeData.experience[i - 1].duration;
        }

        // Fill skills
        for (var i = 1; i <= resumeData.skills.length; i++) {
            document.getElementById('addSkills').click();
            document.getElementById(`skill${i}`).value = resumeData.skills[i - 1];
        }
    });

    function updateResumeOutput() {
        // Updates the resume output with the current resumeData
        resumeOutput.innerHTML = `
           <div class="container">
           <div class="row">
               <button class="btn btn-primary m-1 col-5" onclick='edit()'>EDIT RESUME</button>
               <button class="btn btn-primary m-1 col-5" onclick='save()'>SAVE RESUME</button>
           </div>
           <div class="row" style="background-color: #ababab;">
                        <h2 class="col-12 text-center">${resumeData.name}</h1>
                        <h5 class="col-4 text-center">${resumeData.email}</h5>
                        <h5 class="col-4 text-center">${resumeData.phone}</h5>
                        <h5 class="col-4 text-center">${resumeData.address}</h5>
                    </div>
                    <div class="row">
                        <h2 class="col-12">Educational Background</h2>
                        <div>${generateEducationInfo(resumeData.education)}</div>
                        <h2 class="col-12">Work Experience</h2>
                        <div>${generateExperienceInfo(resumeData.experience)}</div>
                        <h2 class="col-12">My Skills</h2>
                        <div><ul>${generateSkillsInfo(resumeData.skills)}</ul></div>
                    </div>
                </div>
        `;
    }

   function populateFormWithId(resumeId) {
        var resumeData = datum.find(obj => obj.id == resumeId);
        if (resumeData) {
            document.getElementById('name').value = resumeData.name;
            document.getElementById('email').value = resumeData.email;
            document.getElementById('phone').value = resumeData.phone;
            document.getElementById('address').value = resumeData.address;

            // Fill educational background
            for (var i = 1; i <= resumeData.education.length; i++) {
                document.getElementById(`university${i}`).value = resumeData.education[i - 1].university;
                document.getElementById(`degree${i}`).value = resumeData.education[i - 1].degree;
                document.getElementById(`gradYear${i}`).value = resumeData.education[i - 1].gradYear;
            }

            // Fill work experience
            for (var i = 1; i <= resumeData.experience.length; i++) {
                document.getElementById(`company${i}`).value = resumeData.experience[i - 1].company;
                document.getElementById(`position${i}`).value = resumeData.experience[i - 1].position;
                document.getElementById(`duration${i}`).value = resumeData.experience[i - 1].duration;
            }

            // Fill skills
            for (var i = 1; i <= resumeData.skills.length; i++) {
                document.getElementById(`skill${i}`).value = resumeData.skills[i - 1];
            }
        }
    }

    editResumeBtn.addEventListener('click', function () {
        var url = new URLSearchParams(window.location.search);
        var resumeId = url.get('id');
        populateFormWithId(resumeId);

        // Add any additional handling you need for the "Edit" button here
    });

    addEducationBtn.addEventListener('click', function () {
        var educationContainer = document.getElementById('educationContainer');
        var newEducationField = document.createElement('div');

        var invalidEdu = educationContainer.querySelectorAll(':invalid');
        if (invalidEdu.length > 0) {
            console.warn('Empty Fields Exist!');
            document.getElementsByClassName('edu-bg')[0].innerHTML += '<span style="color: red"> (Empty fields)<span>';
            setTimeout(() => {
                document.getElementsByClassName('edu-bg')[0].innerHTML = 'Educational Background';
            }, 400);

        } else {
            educationCounter++;
            console.log(educationCounter);
            function Delete(){
                console.log('Delete');
                document.getElementById('delete-btn').parentElement.removeChild(document.getElementById('delete-btn'));
            }
            newEducationField.innerHTML = `
                <hr>
                <div>
                <input type="text" id="university${educationCounter}" name="university${educationCounter}" placeholder="University" required>
                <input type="text" id="degree${educationCounter}" name="degree${educationCounter}" placeholder="Degree" required>
                <input type="number" id="gradYear${educationCounter}" name="gradYear${educationCounter}" placeholder="Grad Year" required>
                <button id='delete-btn' class='btn btn-danger' onclick='${Delete}'>Delete</button>
                </div>    
            `;
            
            educationContainer.appendChild(newEducationField);
            var list = educationContainer.querySelectorAll(':valid');
            for (var item of list) {
                item.setAttribute("style", "box-shadow: 0 0 0.3rem blue;")
            }
        }
    });
  
    addExperienceBtn.addEventListener('click', function () {
        var experienceContainer = document.getElementById('experienceContainer');
        var newExperienceField = document.createElement('div');

        var invalidExp = experienceContainer.querySelectorAll(':invalid');
        if (invalidExp.length > 0) {
            console.warn('Empty Fields Exist!');
            document.getElementsByClassName('exp-bg')[0].innerHTML += '<span style="color: red"> (Empty fields)<span>';
            setTimeout(() => {
                document.getElementsByClassName('exp-bg')[0].innerHTML = 'Work Experience';
            }, 400);
        } else {
            experienceCounter++;
            newExperienceField.innerHTML = `
                <hr>
                <input type="text" id="company${experienceCounter}" name="company${experienceCounter}" placeholder="Company" required>
                <input type="text" id="position${experienceCounter}" name="position${experienceCounter}" placeholder="Position" required>
                <input type="text" id="duration${experienceCounter}" name="duration${experienceCounter}" placeholder="Duration" required>
            `;
            experienceContainer.appendChild(newExperienceField);
            var list = experienceContainer.querySelectorAll(':valid');
            for (var item of list) {
                item.setAttribute("style", "box-shadow: 0 0 0.3rem yellow;")
            }
        }
    });

    addSkillBtn.addEventListener('click', function () {
        var skillsContainer = document.getElementById('skillsContainer');
        var newSkillField = document.createElement('div');

        var invalidSkill = skillsContainer.querySelectorAll(':invalid');
        if (invalidSkill.length > 0) {
            console.warn('Empty Fields Exist!');
            document.getElementsByClassName('skills-bg')[0].innerHTML += '<span style="color: red"> (Empty fields)<span>';
            setTimeout(() => {
                document.getElementsByClassName('skills-bg')[0].innerHTML = 'Skills';
            }, 400);
        } else {

            skillCounter++;
            newSkillField.innerHTML = `
                <hr>
                <input type="text" id="skill${skillCounter}" name="skill${skillCounter}" required>
            `;
            skillsContainer.appendChild(newSkillField);
        }
    });

    generateResumeBtn.addEventListener('click', function () {
        if (resumeForm.checkValidity()) {
            id = generateUniqueId();
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var phone = document.getElementById('phone').value;
            var address = document.getElementById('address').value;

            var educationInfo = [];
            // Counter starts from 1
            for (var i = 1; i <= educationCounter; i++) {
                var university = document.getElementById(`university${i}`).value || 'Not Eligible';
                var degree = document.getElementById(`degree${i}`).value || 'Not Eligible';
                var gradYear = document.getElementById(`gradYear${i}`).value || 'Not Eligible';
                educationInfo.push({ university, degree, gradYear });
            }

            // Counter starts from 1
            var experienceInfo = [];
            for (var i = 1; i <= experienceCounter; i++) {
                var company = document.getElementById(`company${i}`).value || 'Not Eligible';
                var position = document.getElementById(`position${i}`).value || 'Not Eligible';
                var duration = document.getElementById(`duration${i}`).value || 'Not Eligible';
                experienceInfo.push({ company, position, duration });
            }

            // Counter starts from 1
            var skillsInfo = [];
            for (var i = 1; i <= skillCounter; i++) {
                var skill = document.getElementById(`skill${i}`).value;
                skillsInfo.push(skill);
            }

            function generateUniqueId() {
                id = '_' + Math.random().toString(36).substr(2, 9);
                return id;
            }

            var resumeData = {
                id,
                name,
                email,
                phone,
                address,
                education: educationInfo,
                experience: experienceInfo,
                skills: skillsInfo,
            };

            datum.push(resumeData);
            localStorage.setItem('datum', JSON.stringify(datum));

            var generatedResume = `
                <div class="container">
                    <div class="row" style="background-color: cyan;">
                        <h1 class="col-12 text-center">${name}</h1>
                        <h5 class="col-4 text-center">${email}</h5>
                        <h5 class="col-4 text-center">${phone}</h5>
                        <h5 class="col-4 text-center">${address}</h5>
                    </div>
                    <div class="row">
                        <h3 class="col-12">Educational Background</h2>
                        <div>${generateEducationInfo(educationInfo)}</div>
                        <h3 class="col-12">Work Experience</h2>
                        <div>${generateExperienceInfo(experienceInfo)}</div>
                        <h3 class="col-12">My Skills</h2>
                        <div><ul>${generateSkillsInfo(skillsInfo)}</ul></div>
                    </div>
                    <div class="row">
                        <button class="btn btn-primary m-1 col-5" onclick='edit()'>EDIT</button>
                        <button class="btn btn-primary m-1 col-5" onclick='save()'>SAVE</button>
                    </div>
                </div>
            `;



            var list = resumeForm.querySelectorAll(':valid');
            for (var item of list) {
                item.setAttribute("style", "box-shadow: 0 0 0.3rem green;")
            }
            resumeOutput.innerHTML = generatedResume;
            resumeOutput.classList.remove('hidden');
        } else {
            console.error(resumeForm.checkValidity());
            var list = resumeForm.querySelectorAll(':invalid');
            for (var item of list) {
                item.setAttribute("style", "box-shadow: 0 0 0.3rem red;")
            }
        }
    });

    function generateEducationInfo(educationInfo) {
        return educationInfo.map(info => {
            return `<div class='col-12 btn btn-outline-success'><strong>${info.degree}</strong> from ${info.university}, Graduation Year: ${info.gradYear}</div>`;
        }).join(" ");
    }

    function generateExperienceInfo(experienceInfo) {
        return experienceInfo.map(info => {
            return `<div class='col-12 btn btn-outline-success'><strong>${info.position}</strong> at ${info.company}, Duration: ${info.duration}</div>`;
        }).join(" ");
    }

    function generateSkillsInfo(skillsInfo) {
        return skillsInfo.map(skill => {
            return `<div class='col-2 btn btn-outline-danger'>${skill}</div>`;
        }).join(" ");
    }


});
