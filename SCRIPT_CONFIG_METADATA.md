# Script Configuration Metadata Guide

This guide explains how to add metadata annotations to your Lua scripts to enhance the dashboard configuration experience.

## Basic Setup

Create a configuration table at the top of your Lua script:

```lua
local myScript = {
    enabled = true,
    speed = 100,
    color = "FF0000FF"
}
```

---

## Organizing with Categories

Use `@category:` comments to group settings into collapsible sections:

```lua
local myScript = {
    -- @category: Core
    enabled = true,
    debug_mode = false,

    -- @category: Visual
    show_info = true,
    color = "FF0000FF",

    -- @category: Controls
    toggle_key = "HOME",
    speed = 1.5
}
```

---

## Metadata Annotations

### @dropdown
Creates a dropdown menu with predefined options.

```lua
local myScript = {
    -- @category: Rendering
    mode = "skeleton",        -- @dropdown: skeleton, box, outline, text_only
    quality = "high"          -- @dropdown: low, medium, high, ultra
}
```

### @range
Creates a slider input with min, max, and step values.

```lua
local myScript = {
    -- @category: Settings
    -- @range: 0, 100, 1
    volume = 50,

    -- @range: 0.1, 5.0, 0.1
    speed_multiplier = 1.0,

    thickness = 2             -- @range: 1, 10, 1
}
```

### @multiselect
Creates a multi-select list where users can choose multiple options.

```lua
local myScript = {
    -- @category: Targets
    -- @multiselect: head, chest, stomach, legs, arms
    target_bones = "head",

    -- @multiselect: enemy, team, neutral
    target_types = "enemy"    -- @multiselect: enemy, team, neutral
}
```

### @description
Adds a description/tooltip to explain what a setting does.

```lua
local myScript = {
    -- @category: Core
    -- @description: Master toggle for the entire script
    enabled = true,

    -- @description: Higher values = smoother but more CPU usage
    smoothing = 5             -- @range: 1, 20, 1
}
```

### @requires
Conditionally shows a setting only when another setting has a specific value.

```lua
local myScript = {
    -- @category: Features
    aimbot_enabled = true,

    -- @requires: aimbot_enabled = true
    -- @description: FOV in degrees
    aimbot_fov = 90,          -- @range: 1, 180, 1

    -- @requires: aimbot_enabled = true
    aimbot_smooth = 5.0       -- @range: 0.1, 20.0, 0.1
}
```

---

## Auto-Detected Field Types

The dashboard automatically detects field types based on the value:

| Value Type | Example | UI Element |
|------------|---------|------------|
| Boolean | `enabled = true` | Toggle switch |
| Hex Color (6-8 chars) | `color = "FF0000FF"` | Color picker |
| Hex Color with # | `color = "#FF0000"` | Color picker |
| Number | `speed = 100` | Text input |
| String | `name = "player"` | Text input |

---

## Annotation Placement

Annotations can be placed in two ways:

**Above the setting (on previous line):**
```lua
-- @range: 0, 100, 1
volume = 50
```

**Inline (same line as setting):**
```lua
volume = 50,    -- @range: 0, 100, 1
```

You can also combine multiple annotations:
```lua
-- @description: Controls the master volume level
-- @range: 0, 100, 5
volume = 50
```

---

## Complete Example

```lua
local esp = {
    -- @category: Core
    -- @description: Master toggle for ESP
    enabled = true,
    toggle_key = "INSERT",

    -- @category: Rendering
    -- @dropdown: skeleton, box, outline, corner, text_only
    mode = "skeleton",

    -- @description: Line thickness in pixels
    -- @range: 1, 10, 1
    thickness = 2,

    -- @description: Maximum render distance in game units
    -- @range: 100, 5000, 100
    max_distance = 1000,

    -- @category: Targeting
    -- @multiselect: enemy, team, neutral, friendly
    show_teams = "enemy",

    -- @category: Colors
    -- @description: Color for enemy players (RGBA hex)
    enemy_color = "FF0000FF",

    -- @description: Color for team players (RGBA hex)
    team_color = "00FF00FF",

    -- @category: Advanced
    -- @requires: enabled = true
    -- @description: Enable extra performance optimizations
    performance_mode = false,

    -- @requires: performance_mode = true
    -- @range: 1, 60, 1
    update_rate = 30
}
```

---

## Tips

1. **Categories are collapsible** - Users can expand/collapse each category in the dashboard
2. **Order matters** - Settings appear in the order they're defined in your script
3. **Use descriptions** - Help users understand what each setting does
4. **Validate ranges** - Make sure your range min/max/step values make sense for the setting
5. **Conditional settings** - Use `@requires` to hide advanced options until relevant
