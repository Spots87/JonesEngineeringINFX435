let curLocation = window.location;
let baseUrl = curLocation.protocol + "//" + curLocation.host;
Date.prototype.toShortFormat = function(){
    let monthNames = ["JAN", "FEB", "MAR",
                      "APR", "MAY", "JUN",
                      "JUL", "AUG", "SEP",
                      "OCT", "NOV", "DEC"]
    let day = this.getDate()
    let monthIndex = this.getMonth()
    let year = this.getFullYear()
    return `${day}-${monthNames[monthIndex]}-${year}`
}
function getIds(child, sibling){
    arr =[]
    $("#tasksTable").find(`.${child}`).each(function(idx, i){
        $(i).find(`${sibling}`).each(function(i, option){
            arr.push(($(option).val()))
        })
    })
    return arr
}
$("#jobno").change(function (){
    let jobno = $("#jobno option:selected").val();
    if (jobno.toLowerCase() == "choose job"){
        return;
    }
    let jobApi = baseUrl + "/api/surveyrequest/" + jobno
    $.getJSON(jobApi, function(data){
        $.each(data, function(k, v){
            if(v == null){
                v = "None"
            }
            $(`#${k}`).val(`${v}`)
        });
    });
    $("#tasksTable > tbody").empty()
    let jobSurveyPlanUrl = `${baseUrl}/getjobsurveyplan?jobno=${jobno}`
    $.getJSON(jobSurveyPlanUrl, function(data){
        $.each(data, function(i, obj){
            $("#planno").val(obj.planno)
            $("#tasksTable > tbody:last-child").append(`
            <tr>
                <td class=taskno>
                    <div class="form-group">
                        <input class="form-control taskno" value=${obj.taskno} type="text" readonly>
                     </div>
                </td>
                <td>
                    <div class="form-group">
                        <input id=${obj.taskno}_descrip class="form-control taskdescrip" type="text" readonly>
                     </div>
                </td>
                <td>
                    <div class="form-group">
                        <input class="form-control tasknotes" value=${obj.notes} type="text" readonly>
                     </div>
                </td>
                <td class="crewIds">
                    <select id=${obj.taskno}_crews class="form-control crew">
                    <option selected>Assign Crew</option>
                </td>
                <td class="workdate">
                    <div class="form-group">
                        <input id="workdate" name="workdate" class="form-control" type="text" placeholder="DD-MMM-YYYY">
                    </div>
                </td>
                <td class="crewnotes">
                    <div class="form-group">
                        <input id="crewnotes" name="crewnotes" class="form-control" type="text">
                    </div>
                </td>
            </tr>
            `)
            $.getJSON(`${baseUrl}/api/task/${obj.taskno}`, function(data){
                $(`#${obj.taskno}_descrip`).val(data.description)

            })
            $.getJSON(`${baseUrl}/api/crew`, function(data){
                data['objects'].forEach(function(item){
                    $(`#${obj.taskno}_crews`).append(`<option value=${item['crewno']}>${item['crewno']}</option>`)
                })
            })
        })
    })
});

$("#scheduleForm").submit(function(e){
    e.preventDefault();
    let jobno = $("#jobno").val()
    let planno = $("#planno").val()
    let employeeno = $("#employeeno").val()
    let today = new Date()
    let scheduledate = today.toShortFormat()
    let taskIds = getIds("taskno", ".form-control")
    let crewIds = getIds("crewIds", "select")
    let workDates = getIds("workdate", ".form-control")
    let crewNotes = getIds("crewnotes", ".form-control")
    let assignedObjs = []
    for(let i = 0; i < taskIds.length; i++){
        assignedObjs.push({
            'taskno': taskIds[i],
            'crewno': crewIds[i],
            'workdate': workDates[i],
            'notes': crewNotes[i]
        })
    }
    let assignApi = `${baseUrl}/api/assigned`
    let scheduleApi = `${baseUrl}/api/schedule`
    let count = 0
    assignedObjs.forEach(function(obj){
        $.ajax(assignApi, {
            data: JSON.stringify(obj),
            contentType: "application/json",
            type: "POST",
            success: function(data){
                $.ajax(scheduleApi, {
                    data: JSON.stringify({'planno': planno,
                                          'jobno': jobno,
                                          'assignno': data['assignno'],
                                          'employeeno': employeeno,
                                          'scheduledate': scheduledate}),
                    contentType: "application/json",
                    type: "POST",
                    success: function(data){
                        count++
                        if(count == assignedObjs.length){
                            location.ref= `${baseUrl}/home`
                        }
                    }
                })
            },
            dataType: "json"
        })
    })
})
