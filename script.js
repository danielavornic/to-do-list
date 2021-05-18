if (localStorage.getItem("tasks") === null) {
    var tasks = [{name: 'task 1', status: 'done', index: 0}, {name: 'task 2', status: 'in progress', index: 1}];
    localStorage.setItem("tasks", JSON.stringify(tasks));
} else {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
}
var filter = 'all';

var nothingFoundEl = '<li class="nothing-found text-center">no tasks were found</li>';
function nothingFound() {
    var len = 0;
    tasks.forEach(function(task) {
        if (task.status == filter || filter == 'all') {
            len++
        }
    })
    return len;
}

function showTasks() {
    if (nothingFound() > 0) {
        tasks.forEach(function(task) {
            if (task.status == filter || filter == 'all') {
                var checked = '';
                var style = '';
                if (task.status == 'done') {
                    checked = 'checked';
                    style = 'style="text-decoration:line-through"'
                }
                var taskEl = '<li class="task-container">'+
                                '<label '+style+' class="task" id="'+task.index+'">'+task.name+
                                    '<input type="checkbox" class="taskChk" '+checked+'/>'+
                                    '<span class="checkmark"></span>'+
                                '</label>'+
                                '<i class="fas fa-ellipsis-v menu-handler"></i>'+
                                '<div class="menu-container">'+
                                    '<div class="grid-y">'+
                                        '<div class="cell text-center menu-option edit">edit</div>'+
                                        '<div class="cell text-center menu-option delete">delete</div>'+
                                    '</div>'+
                                '</div>';
                            '</li>'
                if ($('#'+task.index).length == 0) {$('#tasks').append(taskEl);}
            } 
        })
    } else {
        $('.nothing-found').remove();
        $('#tasks').append(nothingFoundEl);
    }
}


function clickTask() {
    $('.task').click(function(e) {
        e.preventDefault()
    });

    $('.task .checkmark').click(function(evt) {
        evt.preventDefault(); 
    
        var name = $(this).parent().text();
        var task = tasks.find(x => x.name === name);
        var index = task.index;
    
        if (tasks[index].status == 'done') {
            tasks[index].status = 'in progress';
            $(this).css({
                'backgroundColor': '#ffffff'
            })
            $(this).parent().css({'text-decoration': 'none'})
        } else if (tasks[index].status == 'in progress') {
            tasks[index].status = 'done';
            $(this).css({
                'backgroundColor': '#00a8a8'
            })
            $(this).parent().css({'text-decoration': 'line-through'})
        }
        
        if (filter == 'in progress' && tasks[index].status == 'done') {
            $(this).parent().parent().remove()
        } else if (filter == 'done' && tasks[index].status == 'in progress') {
            $(this).parent().parent().remove()
        }

        $('.nothing-found').remove();
        if (nothingFound() == 0) {
            $('#tasks').append(nothingFoundEl);
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
    });
}

function menu() {
    $(document).click(function() {
        $('.menu-container').hide();
        $('.menu-handler').css('color', '#E6E6E6');
    });
    $('.menu-handler').click(function(e) {
        e.stopPropagation();
        $('.menu-handler').css('color', '#E6E6E6');
        $(this).css('color', '#00a8a8');
        $('.menu-container').hide();
        $(this).next().show();
        var mousePositionY = e.pageY;
        if ($(window).height() - mousePositionY < 150) {
            $(this).next().css('top', '-68px');
        }
    })

    deleteTask();
    editTask();
}

function editTask() {
    $('.edit').click(function() {
        var label = $(this).parents('.menu-container').siblings('label');
        var taskName = label.text();
        var task = tasks.find(x => x.name === taskName);
        var index = task.index;

        label.contents().filter((_, el) => el.nodeType === 3).remove();
        var form = '<form><input type="text" class="editTask" value="'+taskName+'"/><input class="saveTask" type="submit" value="save"></form>';
        label.prepend(form);
        label.children('.editTask').focus();
        label.next().hide();

        saveEditedTask(index);
    })
}

function saveEditedTask(index) {
    $('.saveTask').click(function() {
        var editedTask = $('.editTask').val();
        tasks[index].name = editedTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        $('#'+index).children('form').remove();
        $('#'+index).prepend(editedTask);
        $('#'+index).next().show();
    })
}

function deleteTask() {
    $('.delete').click(function() {
        var name = $(this).parents('.menu-container').siblings('label').text();
        var task = tasks.find(x => x.name === name);
        var index = task.index;

        tasks.splice(index, 1);

        for (var i=index; i<tasks.length; i++) {
            tasks[i].index = i;
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));

        $(this).parents('li').remove();

        $('.nothing-found').remove();
        if (nothingFound() == 0) {
            $('#tasks').append(nothingFoundEl);
        }
    })
}

$('#userInputContainer').submit(function(e) {
    e.preventDefault();

    var task = {
        name: $('#inputTask').val(),
        status: 'in progress',
        index: tasks.length
    }
    if (task.name != '') {
        $('#inputTask').val('');
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        showTasks();
    }

    $('.nothing-found').remove();
    if (nothingFound() == 0) {
        $('#tasks').append(nothingFoundEl);
    }

    clickTask();
    menu();
})


$('.filter-btn').click(function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    filter = $(this).text();

    $('#tasks').empty();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();

    $('.nothing-found').remove();
    if (nothingFound() == 0) {
        $('#tasks').append(nothingFoundEl);
    }

    clickTask();
    menu();
}) 

showTasks();
clickTask();
menu();