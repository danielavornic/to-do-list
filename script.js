var tasks = [{name: 'task 1', status: 'done', index: 0}, {name: 'task 2', status: 'in progress', index: 1}];
var filter = 'all';

function showTasks() {
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
                'backgroundColor': '#00CECE'
            })
            $(this).parent().css({'text-decoration': 'line-through'})
        }
        
        if (filter == 'in progress' && tasks[index].status == 'done') {
            $(this).parent().parent().remove()
        } else if (filter == 'done' && tasks[index].status == 'in progress') {
            $(this).parent().parent().remove()
        }

        if ($('#tasks li').length == 0) {
            var message = '<li class="nothing-found text-center">no tasks were found</li>';
            $('#tasks').append(message);
        }
    });
}

function menu() {
    $(document).click(function() {
        $('.menu-container').hide();
    });
    $('.menu-handler').click(function(e) {
        e.stopPropagation();
        $('.menu-container').hide();
        $(this).next().show()
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
        var form = '<form><input type="text" id="editTask" value="'+taskName+'"/><input id="saveTask" type="submit" value="save"></form>';
        label.prepend(form);
        label.children('#editTask').focus();

        saveEditedTask(index);
    })
}

function saveEditedTask(index) {
    $('#saveTask').click(function() {
        var editedTask = $('#editTask').val();
        tasks[index].name = editedTask;
        $('#'+index).children('form').remove();
        $('#'+index).prepend(editedTask)
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

        $(this).parents('li').remove();

        if ($('#tasks li').length == 0) {
            var message = '<li class="nothing-found text-center">no tasks were found</li>';
            $('#tasks').append(message);
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
        showTasks();
    }

    $('.nothing-found').remove();

    clickTask();
    menu();
})


$('.filter-btn').click(function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    filter = $(this).text();

    $('#tasks').empty();
    showTasks();

    if ($('#tasks li').length == 0) {
        var message = '<li class="nothing-found text-center">no tasks were found</li>';
        $('#tasks').append(message);
    }

    clickTask();
    menu();
}) 

showTasks();
clickTask();
menu();