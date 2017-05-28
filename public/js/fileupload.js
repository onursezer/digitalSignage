
$(function () {
  $("#files").load("/filelist");
  $("input[type='button']").click(function () {
    var formData = new FormData();
    if ($('#myFile').val() == '') {
      alert("Please choose file!");
      return false;
    }
    $('div.progress').show();
    var file = document.getElementById('myFile').files[0];
    formData.append('uploadfile', file);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/fileUpload', true);
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        $('div.progress div').css('width', percentage.toFixed(0) + '%');
        $('div.progress div').html(percentage.toFixed(0) + '%');
      }
    };
    xhr.onerror = function (e) {
      alert('An error occurred while submitting the form. Maybe your file is too big');
    };
    xhr.onload = function () {
      var file = xhr.responseText;
      $('div.progress div').css('width', '0%');
      $('div.progress').hide();
      showMsg("alert alert-success", "File uploaded successfully!");
      $('#myFile').val('');
    };

    xhr.send(formData);
    return false;

  });

  function showMsg(className, msg) {
    $("#msg").fadeIn();
    $("#files").load("/filelist");
    $("#msg").addClass(className);
    $("#msg").html(msg);
    $("#msg").fadeOut(3000, function () {
      $("#msg").removeClass(className);
    });

  }

  $(document).on('click', '#delete', function () {
    $(this).attr('href', 'javascript:void(0)');
    $(this).html("deleting..");
    var file = $(this).attr("file");
    $.ajax({
      url: '/deleteFile/' + file,
      type: 'GET',
      data: {},
      success: function (res) {
        showMsg("alert alert-danger", "İçeriğin kaldırılması başarılı!")
      }
    });
  });


});

