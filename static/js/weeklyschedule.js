
let curLocation = window.location;
let baseUrl = curLocation.protocol + "//" + curLocation.host;
let infoUrl = `${baseUrl}/weeklyinfo`
$.getJSON(infoUrl, function(data){
    $.each(data, function(i, obj){
        $("#jobinfo > tbody:last-child").append(`
        <tr>
            <td>${obj.jobno}</td>
            <td>${obj.development}</td>
            <td>${obj.restakecount}</td>
        <tr>
        `)
        obj.tasks.forEach(function(t){
            $("#taskinfo > tbody:last-child").append(`
            <tr>
                <td>${t.taskno}</td>
                <td>${t.taskdesc}</td>
                <td>${t.notes}</td>
                <td>${t.crewno}</td>
                <td>${t.assignnotes}</td>
            `)
        })
    })
})
