var resources_loc = 'img/';

var store_existing_balls = [];
var back_button_enabled = false;
var score_previous = 0;
var score = 0;
var highscore = 0;

var temp_run_once_only = true;
var pokeballs = [];
var allow_user = true;
var pokeball_selected = -1;
var pokeball_moving = 0;

var pokeball_sprite_id = 1001;
var pokeball_moves_array = [];
var pokeball_moves_index = -1;

var window_width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

var window_height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

var new_canvas_width = window_width;
var new_canvas_height = window_height;
var pokeball_field = [];
for (var i = 0; i < 9; i++)
{
    pokeball_field[i] = [];
    store_existing_balls[i] = [];
    for (var j = 0; j < 9; j++)
    {
        pokeball_field[i][j] = 0;
        store_existing_balls[i][j] = -1;
    }
}

var debug = false;
var debug_val = 50;
var engine = new VadEngine(1, 1);
var viewport = new VadViewPort();
var drawables = [];
var temp_player_current_speed = 1;
var global_block_counter = 0;
var map_offset_on_create_x = 0;
var map_offset_on_create_y = 0;
var map_width = 607;
var map_height = 686;

var sprite_indicator_red = new VadSprite(resources_loc + 'indicator_red.png', 60, 60, 1, 9999, 0, 0, 1);
var indicator_red = new Drawable(-100, -100, sprite_indicator_red);
var sprite_indicator_green = new VadSprite(resources_loc + 'indicator_green.png', 60, 60, 1, 9999, 0, 0, 1);
var indicator_green = new Drawable(-100, -100, sprite_indicator_green);
var sprite_back_button_off = new VadSprite(resources_loc + 'back_button_off.png', 64, 64, 1, 9999, 0, 0, 1);
var sprite_back_button_on = new VadSprite(resources_loc + 'back_button_on.png', 64, 64, 1, 9999, 0, 0, 1);
var drawable_back_button_off = new Drawable(234, 25, sprite_back_button_off);
var drawable_back_button_on = new Drawable(-100, -100, sprite_back_button_on);
drawable_back_button_on.id = -1;
drawable_back_button_off.id = -1;

var appear1 = new Drawable(-100, -100, sprite_indicator_red);
var appear2 = new Drawable(-100, -100, sprite_indicator_red);
var appear3 = new Drawable(-100, -100, sprite_indicator_red);

var explosion_array = [];
for (var i = 0; i < 9; i++)
{
    explosion_array[i] = [];
    for (var j = 0; j < 9; j++)
    {
        var sprite4 = new VadSprite(resources_loc + 'explosion64x64.png', 64, 64, 25, 10, 0, 0, 5);
        var xxxx = -1000;
        var yyyy = -1000;
        var appear4 = new Drawable(xxxx, yyyy, sprite4);
        explosion_array[i][j] = appear4;
        appear4.sprite.start_playing_once();
    }
}
var animspeed_walking = 60;
var sprite_ball_1 = new VadSprite(resources_loc + 'pokeballs.png', 64, 64, 12, animspeed_walking, 32, 32, 1);
sprite_ball_1.sprite_offset = 0;
var sprite_ball_2 = new VadSprite(resources_loc + 'pokeballs.png', 64, 64, 12, animspeed_walking, 32, 32, 1);
sprite_ball_2.sprite_offset = 64;
var sprite_ball_3 = new VadSprite(resources_loc + 'pokeballs.png', 64, 64, 12, animspeed_walking, 32, 32, 1);
sprite_ball_3.sprite_offset = 128;
var sprite_ball_4 = new VadSprite(resources_loc + 'pokeballs.png', 64, 64, 12, animspeed_walking, 32, 32, 1);
sprite_ball_4.sprite_offset = 192;

var background_image = new Image();
background_image.src = resources_loc + 'lines_field2_2.png';

function PokeBall(style, i, j, x, y)
{
    this.selected_ball = false;
    this.style_ball = style;
    var _this = this;

    this.x = x;
    this.y = y;
    this.cell_i = i;
    this.cell_j = j;

    this.sprite = new VadSprite(resources_loc + 'pokeballs.png', 64, 64, 12, 30, 32, 32, 1);
    if (style == 1) this.sprite.sprite_offset = 0;
    if (style == 2) this.sprite.sprite_offset = 64;
    if (style == 3) this.sprite.sprite_offset = 128;
    if (style == 4) this.sprite.sprite_offset = 192;

    this.id = pokeball_sprite_id;
    this.sprite.id = pokeball_sprite_id;
    pokeball_sprite_id++;
    this.drawable = new Drawable(x, y, this.sprite);

    PokeBall.prototype.animate_start = function()
    {
        this.sprite.sprite_animate();
    }

    PokeBall.prototype.animate_finish = function()
    {
        this.sprite.finish_requested = true;
    }

    PokeBall.prototype.animate_stop = function()
    {
        this.sprite.sprite_idle();
    }

    PokeBall.prototype.movement_happening = function(instance_passed)
    {
        instance_passed = instance_passed[0];
        if (pokeball_selected != -1 && pokeball_moves_array.length > 0)
        {
            allow_user = false;
            var direction = pokeball_moves_array[pokeball_moves_index];
            pokeball_moving += 10;

            if (pokeball_moving == 60)
            {
                if (direction == 0) pokeballs[pokeball_selected].drawable.y -= 9;
                if (direction == 1) pokeballs[pokeball_selected].drawable.x += 9;
                if (direction == 2) pokeballs[pokeball_selected].drawable.y += 9;
                if (direction == 3) pokeballs[pokeball_selected].drawable.x -= 9;
                pokeball_moving = 0;
                pokeball_moves_index++;
                if (pokeball_moves_index + 1 > pokeball_moves_array.length)
                {
                    simple_pop_pokeballs(true);
                    back_button_enabled = true;
                    allow_user = true;

                    drawable_back_button_off.x = -1000;
                    drawable_back_button_off.y = -1000;
                    drawable_back_button_on.x = 234;
                    drawable_back_button_on.y = 25;
                    for (var i = 0; i < 9; i++)
                    {
                        for (var j = 0; j < 9; j++)
                        {
                            var found = -1;
                            for (var z = 0; z < pokeballs.length; z++)
                            {
                                if (pokeballs[z].cell_i == i && pokeballs[z].cell_j == j)
                                {
                                    if (pokeballs[z].sprite.is_idle == false)
                                    {
                                        pokeballs[z].animate_finish();
                                    }
                                    pokeballs[z].selected_ball = false;

                                    found = z;
                                }
                            }
                            if (found == -1)
                            {
                                pokeball_field[i][j] = 0;
                            }
                            else
                            {
                                pokeball_field[i][j] = 1;
                            }
                        }
                    }
                }
            }
            else
            {
                if (direction == 0) pokeballs[pokeball_selected].drawable.y -= 10;
                if (direction == 1) pokeballs[pokeball_selected].drawable.x += 10;
                if (direction == 2) pokeballs[pokeball_selected].drawable.y += 10;
                if (direction == 3) pokeballs[pokeball_selected].drawable.x -= 10;
            }
        }
    }

    PokeBall.prototype.movement_engine_start_once = function()
    {
        engine.step_add(_this.movement_happening, [_this]);
    }
}

function Drawable(x, y, sprite)
{
    this.x = x;
    this.y = y;
    var _this = this;
    this.sprite = sprite;

    Drawable.prototype.draw = function(context)
    {
        this.sprite.draw(context, this.x - viewport.x_offset, this.y - viewport.y_offset);
    }

    Drawable.prototype.remove_from_drawables = function(id)
    {
        var index = -1;
        for (var i = 0; i < drawables.length; i++)
        {
            if (drawables[i].sprite.id == id) index = i;
        }
        if (index > -1)
        {
            drawables.splice(index, 1);
        }
    }
    drawables.push(_this);
}

function processClicks(event)
{
    if (allow_user == false) return;

    var x = event.x | event.clientX;
    var y = event.y | event.clientY;
    var canvas = document.getElementById("myCanvas");
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    process_pokeball(x, y);
}

function process_pokeball(x, y)
{
    y = (y / new_canvas_height) * map_height;
    y = Math.floor(y);
    x = (x / new_canvas_width) * map_width;
    x = Math.floor(x);

    var newx = x - 37;
    var newy = y - 128;

    if (x >= 237 && x <= 294 && y >= 28 && y <= 84)
    {
        if (back_button_enabled)
        {
            back_button_enabled = false;
            allow_user = false;
            load_existing_balls_array();
            allow_user = true;

            drawable_back_button_on.x = -1000;
            drawable_back_button_on.y = -1000;
            drawable_back_button_off.x = 234;
            drawable_back_button_off.y = 25;
        }
        return;
    }

    var row = Math.floor(newy / 59);
    var col = Math.floor(newx / 59);

    if (row >= 0 && row <= 8 && col >= 0 && col <= 8)
    {
        set_indicator(true, row, col);
    }
    else
    {
        return;
    }

    var temp1 = [row, col];
    var index = -1;
    for (var z = 0; z < pokeballs.length; z++)
    {
        var i = pokeballs[z].cell_i;
        var j = pokeballs[z].cell_j;
        if (i == row && j == col) index = z;
    }

    if (index == -1)
    {
        var index_selected = -1;
        for (var z = 0; z < pokeballs.length; z++)
        {
            if (pokeballs[z].selected_ball) index_selected = z;
        }
        if (index_selected != -1)
        {
            var start_i = pokeballs[index_selected].cell_i;
            var start_j = pokeballs[index_selected].cell_j;
            var end_i = row;
            var end_j = col;

            var directions = BFS_to_direction_list(start_i, start_j, end_i, end_j);
            if (directions == -1)
            {
                set_indicator(false, end_i, end_j);
            }
            else
            {
                pokeball_moving = 0;
                pokeball_selected = index_selected;

                allow_user = false;
                save_existing_balls_array();

                pokeball_moves_index = 0;
                pokeball_moves_array = directions;
                pokeballs[index_selected].cell_i = row;
                pokeballs[index_selected].cell_j = col;
                pokeball_field[pokeballs[index_selected].cell_i][pokeballs[index_selected].cell_j] = 0;
                pokeball_field[row][col] = 1;
            }
        }
    }
    else if (index != -1)
    {
        for (var i = 0; i < pokeballs.length; i++)
        {
            if (i == index)
            {
                if (!pokeballs[i].selected_ball)
                {
                    pokeballs[i].animate_start();
                    pokeballs[i].selected_ball = true;
                    pokeball_selected = -1;
                }
            }
            else
            {
                if (pokeballs[i].sprite.is_idle == false)
                {
                    pokeballs[i].animate_finish();
                }
                pokeballs[i].selected_ball = false;
            }
        }
    }
}

function draw_on_canvas()
{
    var c = document.getElementById('myCanvas');
    var ctx = c.getContext('2d');
    ctx.drawImage(background_image, 0 - viewport.x_offset, 0 - viewport.y_offset);

    ctx.font = "33px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, map_width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.fillText(highscore, 495, 42);
    ctx.fillText(score, 495, 88);
    ctx.fillStyle = '#ff00ff';

    engine.step_process_alltasks();

    for (var i = 0; i < drawables.length; i++)
    {
        drawables[i].draw(ctx);
    }
}

function draw_all_pokeballs()
{
    var field_locations = [];
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            var x = 37 + j * 59;
            var y = 28 + i * 59;
            var new_loc = [x, y, i, j];
            field_locations.push(new_loc);
            pokeball_field[i][j] = 0;
        }
    }

    for (var i = 0; i < field_locations.length; i++)
    {
        var x = field_locations[i][0];
        var y = field_locations[i][1];
        x = x - 32 - 5;
        y = y - 32 - 5;
        var choice = 0;
        var rand = Math.random();

        if (rand < 0.25)
        {
            choice = 1;
        }
        else if (rand < 0.50)
        {
            choice = 2;
        }
        else if (rand < 0.75)
        {
            choice = 3;
        }
        else
        {
            choice = 4;
        }
        rand = Math.random();
        if (rand < 0.75) choice = 0;
        if (choice > 0)
        {
            var temp_ball = new PokeBall(choice, field_locations[i][2], field_locations[i][3], x, y);
            pokeball_field[field_locations[i][2]][field_locations[i][3]] = 1;
            temp_ball.sprite.is_idle = true;
            pokeballs.push(temp_ball);
            if (pokeballs.length == 1) pokeballs[0].movement_engine_start_once();
        }
    }
}

function return_node_from_array(BFS_nodes_array, ii, jj)
{
    var found = -1;
    for (var z = 0; z < BFS_nodes_array.length; z++)
    {
        if (BFS_nodes_array[z].i == ii && BFS_nodes_array[z].j == jj) found = z;
    }
    if (found == -1)
    {
        return false;
    }
    else
    {
        return BFS_nodes_array[found];
    }
}

function BFS_to_direction_list(start_i, start_j, end_i, end_j)
{
    var result = BFS_search(start_i, start_j, end_i, end_j);
    if (result == false) return -1;
    var lastnode = [end_i, end_j];
    if (result != false) result.push(lastnode);

    var direction_list = [];
    var i_begin = 0;
    var j_begin = 0;
    var i_end = 0;
    var j_end = 0;
    for (var i = 0; i < result.length; i++)
    {
        if (i == 0)
        {
            i_begin = result[i][0];
            j_begin = result[i][1];
            continue;
        }
        i_end = result[i][0];
        j_end = result[i][1];

        var direction = -1;
        if (i_end > i_begin) direction = 2;
        if (i_end < i_begin) direction = 0;
        if (j_end > j_begin) direction = 1;
        if (j_end < j_begin) direction = 3;
        direction_list.push(direction);

        i_begin = result[i][0];
        j_begin = result[i][1];
    }
    return direction_list;
}

function test_BFS()
{
    var start_i = 0;
    var start_j = 0;
    var end_i = 4;
    var end_j = 4;

    var result = BFS_search(0, 0, 4, 4);
    var lastnode = [end_i, end_j];
    if (result != false) result.push(lastnode);

    var direction_list = [];
    var i_begin = 0;
    var j_begin = 0;
    var i_end = 0;
    var j_end = 0;
    for (var i = 0; i < result.length; i++)
    {
        if (i == 0)
        {
            i_begin = result[i][0];
            j_begin = result[i][1];
            continue;
        }

        i_end = result[i][0];
        j_end = result[i][1];

        var direction = -1;
        if (i_end > i_begin) direction = 2;
        if (i_end < i_begin) direction = 0;

        if (j_end > j_begin) direction = 1;
        if (j_end < j_begin) direction = 3;

        direction_list.push(direction);

        i_begin = result[i][0];
        j_begin = result[i][1];
    }
}

function BFS_search(start_i, start_j, end_i, end_j)
{
    var BFS_nodes_array = collect_all_nodes();
    var tempnode = new BFS_node();
    tempnode.i = start_i;
    tempnode.j = start_j;
    BFS_nodes_array.push(tempnode);

    var startnode = return_node_from_array(BFS_nodes_array, start_i, start_j);
    var endnode = return_node_from_array(BFS_nodes_array, end_i, end_j);
    startnode.startnode = true;
    endnode.endnode = false;
    startnode.visited = true;

    var near_nodes = [];
    near_nodes.push(startnode);
    while (near_nodes.length > 0)
    {
        var first_node = near_nodes.shift();
        first_node.visited = true;

        var templog = [first_node.i, endnode.i, first_node.j, endnode.j];
        if (first_node.i == endnode.i && first_node.j == endnode.j)
        {
            return first_node.moves_array;
        }
        var more_nodes = [];

        more_nodes = BFS_get_nearby_nodes(BFS_nodes_array, first_node);
        for (var z = 0; z < more_nodes.length; z++)
        {
            near_nodes.push(more_nodes[z]);
        }
    }
    return false;
}

function BFS_node()
{
    this.i = -1;
    this.j = -1;
    this.visited = false;
    this.startnode = false;
    this.endnode = false;
    this.moves_array = [];
}

function collect_all_nodes()
{
    BFS_nodes_array = [];
    for (i = 0; i < 9; i++)
    {
        for (j = 0; j < 9; j++)
        {
            if (pokeball_field[i][j] == 0)
            {
                var node = new BFS_node();
                node.i = i;
                node.j = j;
                BFS_nodes_array.push(node);
            }
        }
    }
    return BFS_nodes_array;
}

function BFS_get_nearby_nodes(BFS_nodes_array, node)
{
    var left_node;
    var down_node;
    var up_node;
    var right_node;
    var BFS_queue = [];

    if (node.j > 0) left_node = return_node_from_array(BFS_nodes_array, node.i, node.j - 1);
    if (node.i < 8) down_node = return_node_from_array(BFS_nodes_array, node.i + 1, node.j);
    if (node.i > 0) up_node = return_node_from_array(BFS_nodes_array, node.i - 1, node.j);
    if (node.j < 8) right_node = return_node_from_array(BFS_nodes_array, node.i, node.j + 1);

    if (typeof left_node !== 'undefined' && left_node != false && left_node.visited == false)
    {
        left_node.visited = true;
        left_node.moves_array = node.moves_array.slice(0);
        left_node.moves_array.push([node.i, node.j]);
        BFS_queue.push(left_node);
    }
    if (typeof down_node !== 'undefined' && down_node != false && down_node.visited == false)
    {
        down_node.visited = true;
        down_node.moves_array = node.moves_array.slice(0);
        down_node.moves_array.push([node.i, node.j]);
        BFS_queue.push(down_node);
    }
    if (typeof up_node !== 'undefined' && up_node != false && up_node.visited == false)
    {
        up_node.visited = true;
        up_node.moves_array = node.moves_array.slice(0);
        up_node.moves_array.push([node.i, node.j]);
        BFS_queue.push(up_node);
    }
    if (typeof right_node !== 'undefined' && right_node != false && right_node.visited == false)
    {
        right_node.visited = true;
        right_node.moves_array = node.moves_array.slice(0);
        right_node.moves_array.push([node.i, node.j]);
        BFS_queue.push(right_node);
    }
    return BFS_queue;
}

function set_indicator(green, i, j)
{
    if (green)
    {
        indicator_green.x = 37 + 59 * j - 2;
        indicator_green.y = 128 + 59 * i - 2;
        indicator_red.x = -100;
        indicator_red.y = -100;
    }
    else
    {
        indicator_red.x = 37 + 59 * j - 2;
        indicator_red.y = 128 + 59 * i - 2;
        indicator_green.x = -100;
        indicator_green.y = -100;
    }
}

function remove_ball(i, j)
{
    index_found = -1;
    for (var z = 0; z < pokeballs.length; z++)
    {
        if (pokeballs[z].cell_i == i && pokeballs[z].cell_j == j) index_found = z;
    }

    if (index_found != -1)
    {
        var id = pokeballs[index_found].id;
        pokeballs[index_found].drawable.remove_from_drawables(id);
        pokeball_field[pokeballs[index_found].cell_i][pokeballs[index_found].cell_j] = 0;
        pokeballs.splice(index_found, 1);
    }
}

function get_pokeball_index(i, j)
{
    for (var z = 0; z < pokeballs.length; z++)
    {
        if (pokeballs[z].cell_i == i && pokeballs[z].cell_j == j) return z;
    }
    return -1;
}

function simple_pop_pokeballs(allow_spawning_3_balls)
{
    var done = false;
    var popped_something = false;
    allow_user = false;

    for (var z = 0; z < pokeballs.length; z++)
    {
        var current_ball = pokeballs[z];
        var current_i = current_ball.cell_i;
        var current_j = current_ball.cell_j;
        var current_style = current_ball.style_ball;

        var matches_array = [];
        var current_ball_as_match = [current_i, current_j];
        matches_array.push(current_ball_as_match);
        for (var j = current_j - 1; j >= 0; j--)
        {
            var next_ball = get_pokeball_index(current_i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [current_i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
        for (var j = current_j + 1; j <= 8; j++)
        {
            var next_ball = get_pokeball_index(current_i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [current_i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }

        if (matches_array.length < 5)
        {
            matches_array = [];
            matches_array.push(current_ball_as_match);
        }
        else
        {
            done = true;
        }
        for (var i = current_i - 1; !done && i >= 0; i--)
        {
            var next_ball = get_pokeball_index(i, current_j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, current_j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
        for (var i = current_i + 1; !done && i <= 8; i++)
        {
            var next_ball = get_pokeball_index(i, current_j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, current_j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }

        if (matches_array.length < 5)
        {
            matches_array = [];
            matches_array.push(current_ball_as_match);
        }
        else
        {
            done = true;
        }
        for (var i = current_i - 1, j = current_j - 1; !done && i >= 0 && j >= 0; i--, j--)
        {
            var next_ball = get_pokeball_index(i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
        for (var i = current_i + 1, j = current_j + 1; !done && i <= 8 && j <= 8; i++, j++)
        {
            var next_ball = get_pokeball_index(i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }

        if (matches_array.length < 5)
        {
            matches_array = [];
            matches_array.push(current_ball_as_match);
        }
        else
        {
            done = true;
        }

        for (var i = current_i + 1, j = current_j - 1; !done && i <= 8 && j >= 0; i++, j--)
        {
            var next_ball = get_pokeball_index(i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }

        for (var i = current_i - 1, j = current_j + 1; !done && i >= 0 && j <= 8; i--, j++)
        {
            var next_ball = get_pokeball_index(i, j);
            if (next_ball != -1)
            {
                var new_pokeball = pokeballs[next_ball];
                if (new_pokeball.style_ball == current_style)
                {
                    var temp = [i, j];
                    matches_array.push(temp);
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
        
        if (matches_array.length > 4)
        {
            remove_5_pokeballs(matches_array);

            if (matches_array.length == 5) score += 10;
            if (matches_array.length == 6) score += 14;
            if (matches_array.length == 7) score += 20;
            if (matches_array.length == 8) score += 28;
            if (matches_array.length == 9) score += 38;

            if (score >= highscore)
            {
                highscore = score;
                handle_highscore(false);
            }
            pokeball_selected = -1;
            popped_something = true;
            break;
        }
    }

    if (popped_something == false && allow_spawning_3_balls)
    {
        for (var i = 0; i < 3; i++)
        {
            create_random_pokeball(8);
        }
        simple_pop_pokeballs(false);
    }
    if (popped_something == true)
    {
        simple_pop_pokeballs(false);
    }
    pokeball_selected = -1;
}

function handle_highscore(on_loading)
{
    if (typeof(Storage) !== "undefined")
    {
        if (on_loading)
        {
            if (localStorage.score)
            {
                highscore = Number(localStorage.score);
            }
            else
            {
                localStorage.score = 0;
                highscore = 0;
            }
        }
        else
        {
            if (score >= highscore)
            {
                localStorage.score = highscore;
            }
        }
    }
}

function remove_5_pokeballs(matches_array)
{
    for (var z = 0; z < matches_array.length; z++)
    {
        var i = matches_array[z][0];
        var j = matches_array[z][1];
        var xxxx = (37 + j * 59) - 4;
        var yyyy = (128 + i * 59) - 8;
        explosion_array[i][j].x = xxxx;
        explosion_array[i][j].y = yyyy;
        explosion_array[i][j].sprite.start_playing_once();
        remove_ball(i, j);
    }
}

function save_existing_balls_array()
{
    score_previous = score;
    store_existing_balls = [];
    for (var i = 0; i < 9; i++)
    {
        store_existing_balls[i] = [];
        for (var j = 0; j < 9; j++)
        {
            var index = get_pokeball_index(i, j);
            if (index == -1)
            {
                store_existing_balls[i][j] = -1;
            }
            else
            {
                store_existing_balls[i][j] = pokeballs[index].style_ball;
            }
        }
    }
}

function load_existing_balls_array()
{
    remove_ball(i, j);
    while (pokeballs.length > 0)
    {
        remove_ball(pokeballs[0].cell_i, pokeballs[0].cell_j);
    }

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            pokeball_field[i][j] = 0;
            if (store_existing_balls[i][j] > 0)
            {
                var x = 37 + j * 59 - 32 - 5;
                var y = 128 + i * 59 - 32 - 5;

                var temp_ball = new PokeBall(store_existing_balls[i][j], i, j, x, y);
                pokeball_field[i][j] = 1;
                temp_ball.sprite.is_idle = true;
                pokeballs.push(temp_ball);
            }
        }
    }
    score = score_previous;
}

function create_random_pokeball(count)
{
    var empty_nodes = [];
    for (var i = 0; i < pokeball_field.length; i++)
    {
        for (var j = 0; j < pokeball_field[0].length; j++)
        {
            if (pokeball_field[i][j] == 0) empty_nodes.push([i, j]);
        }
    }
    if (empty_nodes.length > 0)
    {
        var begin_index = 0;
        var end_index = empty_nodes.length - 1;
        var index = Math.floor((Math.random() * end_index) + begin_index);
        var i = empty_nodes[index][0];
        var j = empty_nodes[index][1];

        var x = 37 + j * 59;
        var y = 128 + i * 59;
        x = x - 32 - 5;
        y = y - 32 - 5;
        var choice = 0;
        var rand = Math.random();

        if (rand < 0.25)
        {
            choice = 1;
        }
        else if (rand < 0.50)
        {
            choice = 2;
        }
        else if (rand < 0.75)
        {
            choice = 3;
        }
        else
        {
            choice = 4;
        }
        if (choice > 0)
        {
            var temp_ball = new PokeBall(choice, i, j, x, y);
            pokeball_field[i][j] = 1;
            temp_ball.sprite.is_idle = true;
            if (count == 8)
                pokeballs.push(temp_ball);
            temp_ball.animate_start();
            temp_ball.animate_finish();
            if (count == 0)
            {
                appear1.x = 37 + 59 * j - 2;
                appear1.y = 28 + 59 * i - 2;
            }
            if (count == 1)
            {
                appear2.x = 37 + 59 * j - 2;
                appear2.y = 28 + 59 * i - 2;
            }
            if (count == 2)
            {
                appear3.x = 37 + 59 * j - 2;
                appear3.y = 28 + 59 * i - 2;
            }
            if (temp_run_once_only)
            {
                temp_run_once_only = false;
                pokeballs[0].movement_engine_start_once();
            }
        }
    }
    else
    {
        return;
    }
}

// init
if (window.addEventListener)
{
    window.addEventListener('load', init_game, false);
}
else if (window.attachEvent)
{
    window.attachEvent('onload', init_game);
}

function init_game()
{
    var canvas = document.getElementById('myCanvas');
    mycontroller_start();
    canvas.addEventListener("mousedown", processClicks, false);
    handle_highscore(true);
    for (var i = 0; i < 10; i++)
    {
        create_random_pokeball(8);
    }
}

function mycontroller_start()
{
    setTimeout(function()
    {
        draw_on_canvas();
        mycontroller_start();
    }, 30);
}