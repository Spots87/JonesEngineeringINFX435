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
    let jobSurveyPlanUrl = `${baseUrl}/getjobsurveyplan?jobno=${jobno}`
    $.getJSON(jobSurveyPlanUrl, function(data){
        $.each(data, function(i, obj){
            $("#planno").val(obj.planno)
            console.log("plan no " + obj.planno)
            taskno = obj.taskno
            $("#taskno").val(taskno)
            $("#tasknotes").val(obj.notes)
            $.getJSON(`${baseUrl}/api/task/${taskno}`, function(data){
                $("#taskdescrip").val(data.description)
            })
        })
    })
});
