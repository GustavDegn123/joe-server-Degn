// Håndter signup og opret bruger
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindrer siden i at opdatere
  
    // Hent data fra formularen
    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
  
    // Pak data i et objekt
    const userData = {
        name: name,
        email: email,
        password_hash: password // Det er bedst at hashe password i backend
    };
  
    // Send POST-anmodning til backend for at oprette bruger
    fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created:', data);
        alert("User account created successfully!");
  
        // Vis login-formularen efter oprettelse af bruger
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    })
    .catch(error => console.error('Error creating user:', error));
  });
  
  // Håndter login og start onboarding-processen
  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Forhindr side refresh
  
    // Skjul login-siden og vis onboarding-processen
    document.getElementById("start-page").style.display = "none";
    document.getElementById("onboarding-page").style.display = "block";
  
    // Vis første trin
    openStep(null, 'Step1');
  });
  
  // Åbn det valgte trin og skjul de andre
  function openStep(evt, stepName) {
    var i, tabcontent;
  
    // Skjul alle trin
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
  
    // Vis det valgte trin
    document.getElementById(stepName).style.display = "block";
  
    // Opdater progress-bar
    updateProgress(stepName);
  }
  
  // Gå til næste trin og opdater progress-baren
  function nextStep(step) {
    var nextStep = step + 1;
    var nextStepId = 'Step' + nextStep;
  
    // Eksempel på data (du kan erstatte user_id med dynamiske data)
    var stepData = {
        user_id: 1, // Brug id fra backend eller login data
        step_number: nextStep,
        step_description: document.querySelector("#" + nextStepId + " h3").innerText,
        completed_at: new Date().toISOString()
    };
  
    // Send POST-anmodning til backend for at opdatere onboarding-trinnet
    fetch('/api/onboarding/completeStep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Step updated:', data);
        openStep(null, nextStepId); // Gå til næste trin
    })
    .catch(error => console.error('Error updating step:', error));
  }
  
  // Opdater progress-bar baseret på hvilket trin der er valgt
  function updateProgress(stepName) {
    var progress = 0;
    switch(stepName) {
        case 'Step1':
            progress = 33;
            break;
        case 'Step2':
            progress = 66;
            break;
        case 'Step3':
            progress = 100;
            break;
    }
    document.getElementById("progress-bar").style.width = progress + "%";
  }
  
  // Fuldfør onboarding-processen
  function completeOnboarding() {
    alert("Congratulations! You have completed the onboarding process.");
    document.getElementById("progress-bar").style.width = "100%";
  
    // Eksempel på feedback data
    var feedbackData = {
        user_id: 1, // Brug id fra backend eller login data
        feedback_text: "Great onboarding experience!"
    };
  
    // Send POST-anmodning til backend for at indsende feedback
    fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Feedback submitted:', data);
    })
    .catch(error => console.error('Error submitting feedback:', error));
  }
