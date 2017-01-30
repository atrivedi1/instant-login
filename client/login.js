$(document).ready(() => {

    function handleLoginSubmission(username) {

        let payload = JSON.stringify({ test: username })
        console.log(payload)
        
       $.ajax({
            type: 'POST',
            url: '/me',
            data: payload,
            datatype: 'json',
            contentType: "application/json",
            success: function(data) {
                console.log("success");
                displayUserInfo();
            },
            error: function (err) {
                console.log(err)
            }
            })
        };

    function displayUserInfo() {
        console.log("attempting to display user info")
    };
    
    //event listeners/handlers
    $("#login-form").submit((e) => {
        let userName = $("#login-input").val();
        handleLoginSubmission(userName);
    });
});