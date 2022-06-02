$(document).ready(function () { getList(); });
function getList() {
    // show spinner
    spinnerNotfound(1)
    const settings = { async: true, crossDomain: true, url: `${window.location.pathname}/list`, method: "Get" }
    $.ajax(settings).done(function (res, textStatus) {
        // hidden spinner
        spinnerNotfound(2)
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/website/travel/new" class="btn btn-info">Add new</a>`)
        }
        $("#accordion").empty();
        res.data.forEach((category) => {
            $("#accordion").append(`
              <div class="card">
                <div class="card-header" role="tab" id="${category.id}">
                  <h5 class="mb-0">
                    <a data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne" class="collapsed">${category.en_name} - ${category.ar_name}</a>
                  </h5>
                </div>
                <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="${category.id}">
                  <div class="card-body">
                    <div class="form-row mx-3 my-1">
                      <div class="form-group col-md-6">
                        <label for="en_text">Text en</label>
                        <input readonly type="text" id="en_text" name="en_text" class="form-control" placeholder="text en" rows="3" value="${category.en_text || null}">
                      </div>
                      <div class="form-group col-md-6">
                        <label for="ar_text">Text ar</label>
                        <input readonly type="text" id="ar_text" name="ar_text" class="form-control" placeholder="text ar" rows="3" value="${category.ar_text || null}">
                      </div>
                    </div>
                    <div class="form-row mx-3 my-1">
                      <div class="form-group col-md-6" style="padding-right: 22px; padding-left: 5px">
                        <label for="file">PDF File</label>
                        <div class="custom-file">
                          <label class="custom-file-label" id="custom-file-label" for="file">${category.file || "Choose file"}</label>
                        </div>
                      </div>
                      <div class="form-group col-md-6 d-flex justify-content-center">
                        <video width="400" controls id="media_display"> <source src="/p/img/${category.file}" type="video/mp4">Your browser does not support HTML5 video.</video>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6 m-2" id="editBtn"></div>
                </div>
              </div>
            `);
            if (category.en_description) {
                $('#en_description_div').append(`
                    <label for="en_description">Description en</label>
                    <textarea disabled type="text" id="en_description" name="en_description" class="form-control" placeholder="description en" rows="3">${category.en_description || null}</textarea>
                `);
            }
            if (category.ar_description) {
                $('#ar_description_div').append(`
                    <label for="ar_description">Description ar</label>
                    <textarea disabled type="text" id="ar_description" name="ar_description" class="form-control" placeholder="description ar" rows="3">${category.ar_description || null}</textarea>
                `);
            }
            if (res.canEdit) {
                $('#editBtn').append(`<a type="button" href="/website/travel/edit/${category.id}" class="btn btn-info">Edit ${category.en_name}</a>`);
            }
        })
    }).fail(() => spinnerNotfound(3))
}

function spinnerNotfound(action) {
    // 1 => Show Spinner
    // 2 => Hidden Spinner
    // 3 => Notfound
    if (action == 1) {
        $("#tabe-items").hide();
        $("#spinner-notfound>div").html(`<div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div>`);
        $("#spinner-notfound").show();
    } else if (action == 2) {
        $("#spinner-notfound").hide();
        $("#tabe-items").show();
    } else if (action == 3) {
        $("#tabe-items").hide();
        $("#spinner-notfound>div").html(`<p>Not found items</p>`);
        $("#spinner-notfound").show();
    }

}