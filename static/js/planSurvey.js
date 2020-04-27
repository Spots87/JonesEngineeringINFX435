$(function(){
    $("#removeTask").hide()
    $("#addTask").click(function(){
        let taskId = $("#taskInfo").val()
        let taskDescription = $("#taskInfo option:selected").text()
        let taskNotes = $("#taskNotes").val()
        console.log(taskNotes)
        $(".list-group").append(`<li class='list-group-item'>${taskId}|${taskDescription}|${taskNotes}</li>`)
        $("#removeTask").show()
    })

    $("#addedTasks").on("click", ".list-group-item", function(){
        $(this).addClass('active').siblings().removeClass('active')
    })

    $("#removeTask").click(function(){
        $(".list-group-item.active").remove();
    })

    $("#planSurveyForm").submit(function(e){
        e.preventDefault();
        tasks = []
        $(".list-group li").each(function(idx, i){
            let taskParts = $(i).text().split("|")
            task = {"taskno": taskParts[0],
                    "taskdescription": taskParts[1],
                    "tasknotes": taskParts[2]
            }
            tasks.push(task)
        })
        jobno = $("#surveyrequest option:selected").val()

        surveyplan = {
            "jobno": jobno,
            "tasks": tasks
        }

        let url = 'http://localhost:5000/plansurvey'
        $.ajax(url, {
            data: JSON.stringify(surveyplan),
            contentType: "application/json",
            type: "POST"
        })

    })
})
