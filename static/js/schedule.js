$("#jobno").change(function (){
    let curLocation = window.location;
    let baseUrl = curLocation.protocol + "//" + curLocation.host;
    let jobno = $("#jobno option:selected").val();
    let jobApi = baseUrl + "/api/surveyrequest/" + jobno
    console.log(jobApi)
    $.getJSON(jobApi, function(data){
        $.each(data, function(k, v){
            if(v == null)
                v = "None"
            $(`#${k}`).val(`${v}`)
        });
    });
});
