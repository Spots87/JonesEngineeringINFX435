let curLocation = window.location;
let baseUrl = curLocation.protocol + "//" + curLocation.host;
function getIds(child, sibling){
    arr =[]
    $("#workdetails").find(`.${child}`).each(function(idx, i){
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
            if(v == null)
                v = "None"
            $(`#${k}`).val(`${v}`)
        });
    });
    $("#workdetails > tbody").empty()
    let scheduleApi = `${baseUrl}/api/schedule`
    let assignApi = `${baseUrl}/api/assigned`
    let filters = [{'name':'jobno', 'op':'eq', 'val':jobno}]
    let assignNos = []
    let taskNos = []
    let planno = null
    $.getJSON(scheduleApi,
        {"q": JSON.stringify({"filters": filters})}
    ).done(function(data){
        data['objects'].forEach(function(s){
            assignNos.push(s['assignno'])
            planno = s['planno']
        })
        assignNos.forEach(function(id){
            $.getJSON(`${assignApi}/${id}`
            ).done(function(data){
                $("#workdetails > tbody:last-child").append(`
                    <tr>
                        <td>
                            <div class="form-group">
                                <input id=${data['taskno']}class="form-control taskid" value=${data['taskno']} type="text" readonly>
                             </div>
                        </td>
                        <td>
                            <div class="form-group">
                                <input id=${data['taskno']}_descrip class="form-control taskdescrip" type="text" readonly>
                             </div>
                        </td>
                        <td>
                            <div class="form-group">
                                <input id=${data['taskno']}_note class="form-control tasknote" type="text" readonly>
                             </div>
                        </td>
                        <td>
                            <div class="form-group">
                                <input id=${data['taskno']}_workdate class="form-control workdate" value=${data['workdate']} type="text" readonly>
                            </div>
                        </td>
                        <td class="completestatus">
                            <div class="form-check">
                                <input class="form-check-input completeTask" name="${data['taskno']}_status" type="radio" value="Y" checked>
                                <label class="form-check-label" for="completeTask">Complete</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input incompleteTask" name="${data['taskno']}_status" type="radio" value="N">
                                <label class="form-check-label" for="completeTask">Incomplete</label>
                            </div>
                        </td>
                        <td class="pagenos">
                            <div class="form-group">
                                <input class="form-control pageno" type="text">
                            </div>
                        </td>
                        <td class="booknos">
                            <div class="form-group">
                                <input class="form-control" type="text">
                            </div>
                        </td>
                    </tr>
                `)
                let taskApi = `${baseUrl}/api/task/${data['taskno']}`
                let planApi = `${baseUrl}/api/surveyplan/${planno}`
                $.getJSON(taskApi).done(function(taskjson){
                    $(`#${data['taskno']}_descrip`).val(taskjson['description'])
                })
                $.getJSON(planApi).done(function(planjson){
                    $(`#${data['taskno']}_note`).val(planjson['notes'])
                })
            })
        })
    })
});

$("#fieldworkForm").submit(function(e){
    e.preventDefault()
    let jobno = $("#jobno option:selected").val();
    let employeeno = $("#employeeno").val()
    let scheduleApi = `${baseUrl}/api/schedule`
    let scheduleNos = []
    let filters = [{'name':'jobno', 'op':'eq', 'val':jobno}]
    $.getJSON(scheduleApi,
        {"q": JSON.stringify({"filters": filters})}
    ).done(function(data){
        data['objects'].forEach(function(s){
            scheduleNos.push(s['scheduleno'])
        })
        let bookNos = getIds('booknos', '.form-control')
        let pageNos = getIds('pagenos', '.form-control')
        let completeStatuses = getIds('completestatus', '.form-check-input:checked')
        console.log(jobno)
        console.log(scheduleNos)
        console.log(completeStatuses)
        console.log(bookNos)
        console.log(pageNos)
        console.log(employeeno)
        let reportApi = `${baseUrl}/api/surveyreport`
        console.log(scheduleNos.length)
        for(let i=0; i < scheduleNos.length; i++){
            $.ajax(reportApi, {
                data: JSON.stringify({
                        "jobno": jobno,
                        "scheduleno": scheduleNos[i],
                        "iscompleted": completeStatuses[i],
                        "fieldbookno": bookNos[i],
                        "beginningpageno": pageNos[i],
                        "employeeno": employeeno}),
                type: "POST",
                contentType: "application/json"
            })
        }
    })
})
