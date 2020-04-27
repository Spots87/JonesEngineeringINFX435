$("#jobno").change(function (){
    let curLocation = window.location;
    let baseUrl = curLocation.protocol + "//" + curLocation.host;
    let jobno = $("#jobno option:selected").val();
    if (jobno.toLowerCase() == "choose job"){
        return;
    }
    let jobApi = baseUrl + "/api/surveyrequest/" + jobno
    $.getJSON(jobApi, function(data){
        $.each(data, function(k, v){
            if(v == null)
                v = "None"
            $(`#${k}`).val(`${v}`)
        });
    });
    $("#tasksTable > tbody").empty()
    let jobSurveyPlanUrl = `${baseUrl}/getjobsurveyplan?jobno=${jobno}`
    $.getJSON(jobSurveyPlanUrl, function(data){
        $.each(data, function(i, obj){
            $("#tasksTable > tbody:last-child").append(`
            <tr>
                <td>
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
                <td>
                    <select id="crewno" name="crewno" class="form-control">
                    <option selected>Assign Crew</option>
                </td>
                <td>
                    <div class="form-group">
                        <input id="workdate" name="workdate" class="form-control" type="text" placeholder="DD-MMM-YYYY">
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input id="crewnotes" name="crewnotes" class="form-control" type="text">
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input id="employeeno" name="employeeno" class="form-control" type="text">
                    </div>
                </td>
            </tr>
            `)
            $.getJSON(`${baseUrl}/api/task/${obj.taskno}`, function(data){
                $(`#${obj.taskno}_descrip`).val(data.description)

            })
        })
    })
});
