function initApp() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            $("#lat").val(position.coords.latitude).parent().addClass("is-focused");
            $("#lng").val(position.coords.longitude).parent().addClass("is-focused");
        });
    }
    $(".add-info-dialog-button").on("click", openAddInfoDialog);
    $("#save-add-info-button").on("click", saveDataInfo);
    $("#cancel-add-info-button").on("click", closeAddInfoDialog);
    $("#quick-entry-switch-mobile, #quick-entry-switch-desktop").on("change", toggleQuickEntry);
    $(".entry-card").on("click", toggleItem);
    $.each($(".entry-card"), function (k, v) {
        $(this).attr("data-max-height", $(this).height());
        var maxHeight = 56;
        if (k === 0) maxHeight = $(this).height();
        $(this).css("max-height", maxHeight + "px");
    });
    initDateTimePicker();
    positionResize();
    $(window).on("resize", positionResize);
    var content = $("#add-item");
    content.css("max-height", content.height() + parseInt(content.css("padding-top")) + parseInt(content.css("padding-bottom")));
}

function openAddInfoDialog(e) {
    var button = $(e.currentTarget);
    var dialog = $('#add-data-info-dialog');
    dialog.find("h3").text(button.data("data-info-text") + " toevoegen");
    dialog.find("#add-data-info-type").val(button.data("data-info-type"));
    console.log(button.data("data-info-type"));
    dialog[0].MaterialDialog.show(true);
}

function saveDataInfo() {
    var name = $("#add-data-info").val();
    var type = $("#add-data-info-type").val();
    $.ajax({
        data: {
            name: name,
            function: "create",
            type: type
        },
        url: "includes/dataInfo.php",
        method: "POST",
        success: function (id) {
            addDataInfoToList(type, id, name);
            closeAddInfoDialog();
        }
    });
}

function addDataInfoToList(type, id, name) {
    switch (type) {
        case "category":
            var item = "<li class=\"mdl-menu__item category-item\">" +
                            "<input id=\"category-" + id + "\" value=\"" + id + "\" name=\"category\" type=\"radio\">" +
                            "<label for=\"category-" + id + "\">" + name + "</label>" +
                        "</li>";
            $("#category-list").append(item);
            break;
        case "dataType":
            var item = "<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"datatype-" + id + "\">" +
                            "<input type=\"checkbox\" id=\"datatype-" + id + "\" name=\"data-types[]\" class=\"mdl-checkbox__input\" value=\"" + id + "\">" +
                            "<span class=\"mdl-checkbox__label\">" + name + "</span>" +
                        "</label>";
            $("#data-type-list").append(item);
            break;
        case "company":
            var item = "<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"company-" + id + "\">" +
                            "<input type=\"checkbox\" id=\"company-" + id + "\" name=\"companies[]\" class=\"mdl-checkbox__input\" value=\"" + id + "\">" +
                            "<span class=\"mdl-checkbox__label\">" + name + "</span>" +
                        "</label>";
            $("#company-list").append(item);
            break;
    }
    componentHandler.upgradeAllRegistered();
    var content = $("#add-item");
    content.css("max-height", "initial");
    content.css("max-height", content.height() + parseInt(content.css("padding-top")) + parseInt(content.css("padding-bottom")));
}

function closeAddInfoDialog() {
    var dialog = $('#add-data-info-dialog');
    dialog[0].MaterialDialog.close();
    $("#add-data-info").val("");
}

function initDateTimePicker() {
    $("#date").bootstrapMaterialDatePicker({
        weekStart: 0,
        format: "DD/MM/YYYY",
        time: false,
        lang: "nl",
        currentDate: moment(new Date())
    });
    $("#time").bootstrapMaterialDatePicker({
        weekStart: 0,
        format: "H:mm",
        date: false,
        lang: "nl",
        currentDate: moment(new Date())
    });
}

function toggleQuickEntry() {
    var toggle1 = $("#quick-entry-switch-mobile");
    var toggle2 = $("#quick-entry-switch-desktop");
    var toggle = isMobile() ? toggle1 : toggle2;
    var content = $("#add-item");
    if (toggle.prop("checked")) {
        toggle1.prop("checked", true);
        toggle2.prop("checked", true);
        $(".quick-entry").addClass("is-checked");
        content.addClass("quick-entry-mode");
        setTimeout(function () {
            content.addClass("hide-items");
            positionResize();
        }, 300);
    } else {
        $(".quick-entry").removeClass("is-checked");
        toggle1.prop("checked", false);
        toggle2.prop("checked", false);
        content.removeClass("hide-items");
        setTimeout(function () {
            content.removeClass("quick-entry-mode");
            setTimeout(function () {
                positionResize();
            }, 300);
        }, 10);
    }
}

function toggleItem() {
    var item = $(this);
    var currentItem = $(".entry-card.show");
    var content = $(".content-section");
    var maxHeightColl = 56;
    if (item.hasClass("collapsed")) {
        currentItem.removeClass("show").css("max-height", maxHeightColl + "px");
        setTimeout(function () {
            currentItem.addClass("collapsed");
            setTimeout(function () {
                positionResize();
            }, 10);
        }, 200);
        item.removeClass("collapsed");
        setTimeout(function () {
            item.addClass("show").css("max-height", item.attr("data-max-height") + "px");
            setTimeout(function () {
                positionResize();
            }, 200);
        }, 10);
    } else {
        item.removeClass("show").css("max-height", maxHeightColl + "px");
        setTimeout(function () {
            item.addClass("collapsed");
            setTimeout(function () {
                positionResize();
            }, 10);
        }, 200);
    }
}

function positionResize() {
    var content = $(".content-section");
    var max = $(window).height() - $(".mdl-layout__header").height() - 32 - parseInt(content.css("padding-top")) - parseInt(content.css("padding-bottom"));
    if (content.height() > max) content.addClass("static").removeClass("absolute");
    else content.addClass("absolute").removeClass("static");
}

function isMobile () {
    return $(window).width() < 461;
}
