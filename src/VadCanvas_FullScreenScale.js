var map_width;
var map_height;
var new_canvas_width;
var new_canvas_height;

function start_application()
{
    mobile_on_resize();
}

function mobile_on_resize()
{
    var desired_width = map_width;
    var desired_height = map_height;
    var width_bigger = false;
    if (desired_width >= desired_height) width_bigger = true;

    var desired_ratio;
    if (desired_width < desired_height)
    {
        desired_ratio = desired_width / desired_height;
    }
    else
    {
        desired_ratio = desired_height / desired_width;
    }

    window_width = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

    window_height = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    var screenAvailWidth = window_width;
    var screenAvailHeight = window_height;

    if (screenAvailWidth < screenAvailHeight)
    {
        if (width_bigger)
        {
            var new_width = screenAvailWidth;
            var new_height = new_width * desired_ratio;
            new_canvas_width = new_width;
            new_canvas_height = (Math.floor(new_height * 100)) / 100;
            var xx = Math.floor(((new_height / screenAvailHeight) * 100)) / 100;
            xx = xx * 100;
            xx = (xx | 0);
            var canvas = document.getElementById("myCanvas");
            var top_offset = Math.floor((screenAvailHeight - new_height) / 2);
            canvas.style.left = 0 + 'px';
            canvas.style.top = top_offset + 'px';
            var percent = '' + (xx | 0) + '%';
            canvas.style.height = percent;
            canvas.style.width = '99%';
            canvas.style.position = 'absolute';
        }
        else
        {
            var new_height = screenAvailHeight;
            var new_width = new_height * desired_ratio;
            new_canvas_height = new_height;
            new_canvas_width = Math.floor((new_width * 100) / 100);
            var xx = Math.floor(((new_width / screenAvailWidth) * 100)) / 100;

            xx = xx * 100;
            xx = (xx | 0);
            var canvas = document.getElementById("myCanvas");
            var left_offset = Math.floor((screenAvailWidth - new_width) / 2);
            canvas.style.top = 0 + 'px';
            canvas.style.left = left_offset + 'px';
            var percent = '' + (xx | 0) + '%';
            canvas.style.width = percent;
            canvas.style.height = '99%';
            canvas.style.position = 'absolute';
        }
    }
    if (screenAvailWidth >= screenAvailHeight)
    {

        if (width_bigger)
        {
            var new_height = screenAvailHeight;
            var new_width = new_height / desired_ratio;
            new_canvas_height = new_height;
            new_canvas_width = (Math.floor(new_width * 100)) / 100;

            var xx = Math.floor(((new_width / screenAvailWidth) * 100)) / 100;
            xx = xx * 100;
            xx = (xx | 0);
            var canvas = document.getElementById("myCanvas");
            var left_offset = Math.floor((screenAvailWidth - new_width) / 2);
            canvas.style.top = 0 + 'px';
            canvas.style.left = left_offset + 'px';
            var percent = '' + (xx | 0) + '%';
            canvas.style.width = percent;
            canvas.style.height = '99%';
            canvas.style.position = 'absolute';
        }
        else
        {
            var new_height = screenAvailHeight;
            var new_width = Math.floor(new_height * desired_ratio);
            new_canvas_height = new_height;
            new_canvas_width = Math.floor((Math.floor(new_width * 100)) / 100);
            var xx = Math.floor(((new_width / screenAvailWidth) * 100)) / 100;

            xx = xx * 100;
            xx = (xx | 0);
            var canvas = document.getElementById("myCanvas");
            var left_offset = Math.floor((screenAvailWidth - new_width) / 2);
            canvas.style.top = 0 + 'px';
            canvas.style.left = left_offset + 'px';
            var percent = '' + (xx | 0) + '%';
            canvas.style.width = percent;
            canvas.style.height = '99%';
            canvas.style.position = 'absolute';
        }
    }

    var percent_width = canvas.style.width + "";
    percent_width = percent_width.substring(0, percent_width.indexOf('%'));
    var percent_height = canvas.style.height + "";
    percent_height = percent_height.substring(0, percent_height.indexOf('%'));
    percent_width = (percent_width | 0);
    percent_height = (percent_height | 0);

    if (percent_width > 100 || percent_height > 100)
    {
        var width_bigger = false;
        if (percent_width > percent_height) width_bigger = true;
        
        if (width_bigger)
        {
            var ratio = (99 / percent_width);
            var create_new_width = new_canvas_width * ratio;
            create_new_width = (Math.floor(create_new_width * 100)) / 100;
            var create_new_height = new_canvas_height * ratio;
            create_new_height = (Math.floor(create_new_height * 100)) / 100;

            var left_offset = Math.floor((screenAvailWidth - create_new_width) / 2);
            var top_offset = Math.floor((screenAvailHeight - create_new_height) / 2);
            canvas.style.left = left_offset + 'px';
            canvas.style.top = top_offset + 'px';

            var xx = Math.floor(((create_new_width / screenAvailWidth) * 100)) / 100;
            xx = xx * 100;
            xx = (xx | 0);
            var percentxx = '' + (xx | 0) + '%';

            var yy = Math.floor(((create_new_height / screenAvailHeight) * 100)) / 100;
            yy = yy * 100;
            yy = (yy | 0);
            var percentyy = '' + (yy | 0) + '%';

            canvas.style.width = percentxx;
            canvas.style.height = percentyy;
            new_canvas_width = create_new_width;
            new_canvas_height = create_new_height;
            canvas.style.position = 'absolute';
        }
    }
}

function canvas_scale_init()
{
    var canvas_ele = document.getElementById('myCanvas');
    map_width = canvas_ele.width;
    map_height = canvas_ele.height;
    start_application();
    if (window.attachEvent)
    {
        window.attachEvent('onresize', function()
        {
            mobile_on_resize();
        });
    }
    else if (window.addEventListener)
    {
        window.addEventListener('resize', function()
        {
            mobile_on_resize();
        }, true);
    }
    document.body.style.backgroundColor = "black";
    var meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName('head')[0].appendChild(meta);
}

// init

if (window.addEventListener)
{
    window.addEventListener('load', canvas_scale_init, false);
}
else if (window.attachEvent)
{
    window.attachEvent('onload', canvas_scale_init);
}