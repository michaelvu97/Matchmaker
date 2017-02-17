const LAST_INDEX = 10
const TAKE_PHOTO = "Take Photo"
const RETAKE_PHOTO = "Retake Photo"
var webcamFrozen = false
var takingPhoto = false
var numUsers = 0
var saving = false

function getNumUsers () {
    $.get("http://localhost:3000", function(data) {
        numUsers = parseInt(data)
    })
}

function sendForm () {
        console.log('posting')

        var person = {
            name:       $('#1').val(),
            discipline: $('#2').val(),
            color:      $('#3').val(),
            animal:     $('#4').val(),
            trinity:    $('#5').val(),
            skuleplace: $('#6').val(),
            prof:       $('#7').val(),
            year:       $('#8').val(),
            date:       $('#9').val()
        }

        // New POST
        $.ajax({
            url:'http://localhost:3000',
            type:'post',
            dataType:'json',
            data: JSON.stringify(person)
        })
}

function refreshPage() {
    setTimeout(function () {
        var a = document.createElement('a')
        a.href = "main.html"
        document.body.appendChild(a)
        a.click()
    }, 1000)
}

function download(data_uri, filename, type) {
     var a = document.createElement("a")
    a.href = data_uri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

$(document).ready(function() {

    Webcam.attach('#my_camera')

    getNumUsers()

    /*
     * Take photo button.
     */
    $('#0').click( function () {
        if (!takingPhoto) {
            
            // Countdown to take photo
            takingPhoto = true
            Webcam.unfreeze()

            $(this).text(3)
            setTimeout(function () {
                $('#0').text(2)
                setTimeout(function () {
                    $('#0').text(1)
                    setTimeout(function () {
                        takingPhoto = false
                        $('#0').text(RETAKE_PHOTO)
                        Webcam.freeze()
                        webcamFrozen = true
                    }, 750)
                }, 750)
            }, 750) 

        }
    })

    // Give initial focus to photo button.
    $('#0').focus()

    function submit () {
        var allFormsHaveContent = true
        // Check if all forms have content

        if (webcamFrozen && allFormsHaveContent && !saving) {
            
            saving = true

            Webcam.snap( function(data_uri) {
                download(data_uri, numUsers + ".png","png")
                sendForm()
                refreshPage()
            })

        } else if (!saving) {
            alert('Please take a photo first')
        }
    }

    $('#click-me').click(sendForm)
    $('#' + LAST_INDEX  ).click(submit)

    // Have backspace go on empty input go to the previous input.
    $(':input').keydown(function(e) {
        console.log(e.which)
        // Get the current input's id.
        var index = parseInt($(this).attr('id'))

        // Point to the previous object.
        if (index != 0) {
            if ((e.which == 8 || e.which == 46) 
                 && $(this).val() == '') {

                var prevObj = $('#' + (index - 1))

                // Ignore the backspace input.
                prevObj.val(prevObj.val() + ' ')
                $('#' + (index - 1)).focus()

            }

            // up arrow
            if (e.which == 38) {
                $('#'+(index - 1)).focus()
            }

        }

        // Down arrow
        if (index != LAST_INDEX && e.which == 40) {
            $('#'+(index + 1)).focus()
        }
        
        // Enter
        if (index != LAST_INDEX - 1 && e.which == 13) {
            $(':focus').click()
            $('#'+(index + 1)).focus()   
        }
        
    })

})