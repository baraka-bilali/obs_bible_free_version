--[[
      OBS Studio Lua script : Control Bible verses display with hotkeys
      Adapted from: Animated-Lower-Thirds project
      Version: 1.0
      Released: 2025-02-04
--]]


local obs = obslua
local debug
local hk = {}
local hotkeyDisplayVerse = 0;
local hotkeyHideVerse = 0;
local hotkeySlot1 = 0;
local hotkeySlot2 = 0;
local hotkeySlot3 = 0;
local hotkeySlot4 = 0;
local hotkeySlot5 = 0;
local hotkeySlot6 = 0;
local hotkeySlot7 = 0;
local hotkeySlot8 = 0;
local hotkeySlot9 = 0;
local hotkeySlot10 = 0;


-- Hotkeys definitions
local hotkeys = {
	DISPLAY_VERSE = "Display Verse",
	HIDE_VERSE = "Hide Verse",
	SLOT_01 = "Load Verse Slot #1",
	SLOT_02 = "Load Verse Slot #2",
	SLOT_03 = "Load Verse Slot #3",
	SLOT_04 = "Load Verse Slot #4",
	SLOT_05 = "Load Verse Slot #5",
	SLOT_06 = "Load Verse Slot #6",
	SLOT_07 = "Load Verse Slot #7",
	SLOT_08 = "Load Verse Slot #8",
	SLOT_09 = "Load Verse Slot #9",
	SLOT_10 = "Load Verse Slot #10",
}

-- Handle hotkey actions
local function onHotKey(action)
	if debug then obs.script_log(obs.LOG_INFO, string.format("Hotkey : %s", action)) end

	if action == "DISPLAY_VERSE" then
		if hotkeyDisplayVerse == 0 then
			hotkeyDisplayVerse = 1
		else
			hotkeyDisplayVerse = 0
		end
		update_hotkeys_js()
	elseif action == "HIDE_VERSE" then
		hotkeyDisplayVerse = 0
		update_hotkeys_js()
	elseif action == "SLOT_01" then
		if hotkeySlot1 == 0 then
			hotkeySlot1 = 1
		else
			hotkeySlot1 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_02" then
		if hotkeySlot2 == 0 then
			hotkeySlot2 = 1
		else
			hotkeySlot2 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_03" then
		if hotkeySlot3 == 0 then
			hotkeySlot3 = 1
		else
			hotkeySlot3 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_04" then
		if hotkeySlot4 == 0 then
			hotkeySlot4 = 1
		else
			hotkeySlot4 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_05" then
		if hotkeySlot5 == 0 then
			hotkeySlot5 = 1
		else
			hotkeySlot5 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_06" then
		if hotkeySlot6 == 0 then
			hotkeySlot6 = 1
		else
			hotkeySlot6 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_07" then
		if hotkeySlot7 == 0 then
			hotkeySlot7 = 1
		else
			hotkeySlot7 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_08" then
		if hotkeySlot8 == 0 then
			hotkeySlot8 = 1
		else
			hotkeySlot8 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_09" then
		if hotkeySlot9 == 0 then
			hotkeySlot9 = 1
		else
			hotkeySlot9 = 0
		end
		update_hotkeys_js()
	elseif action == "SLOT_10" then
		if hotkeySlot10 == 0 then
			hotkeySlot10 = 1
		else
			hotkeySlot10 = 0
		end
		update_hotkeys_js()
	end
end


-- Write settings to JS file
function update_hotkeys_js()
    local output = assert(io.open(script_path() .. '../common/js/hotkeys.js', "w"))
    output:write('hotkeyDisplayVerse = '.. hotkeyDisplayVerse .. ';\n')
    output:write('hotkeyHideVerse = '.. hotkeyHideVerse .. ';\n')
	output:write('hotkeySlot1 = '.. hotkeySlot1 .. ';\n')
	output:write('hotkeySlot2 = '.. hotkeySlot2 .. ';\n')
	output:write('hotkeySlot3 = '.. hotkeySlot3 .. ';\n')
	output:write('hotkeySlot4 = '.. hotkeySlot4 .. ';\n')
	output:write('hotkeySlot5 = '.. hotkeySlot5 .. ';\n')
	output:write('hotkeySlot6 = '.. hotkeySlot6 .. ';\n')
	output:write('hotkeySlot7 = '.. hotkeySlot7 .. ';\n')
	output:write('hotkeySlot8 = '.. hotkeySlot8 .. ';\n')
	output:write('hotkeySlot9 = '.. hotkeySlot9 .. ';\n')
	output:write('hotkeySlot10 = '.. hotkeySlot10 .. ';\n')
	output:close()
end

----------------------------------------------------------

-- Called on startup
function script_load(settings)
	function pairsByKeys (t, f)
		local a = {}
		for n in pairs(t) do table.insert(a, n) end
		table.sort(a, f)
		local i = 0
		local iter = function ()
		  i = i + 1
		  if a[i] == nil then return nil
		  else return a[i], t[a[i]]
		  end
		end
		return iter
	end	

	for name, line in pairsByKeys(hotkeys) do
		hk[name] = obs.obs_hotkey_register_frontend(name, line, function(pressed) if pressed then onHotKey(name) end end)
		local hotkeyArray = obs.obs_data_get_array(settings, name)
		obs.obs_hotkey_load(hk[name], hotkeyArray)
		obs.obs_data_array_release(hotkeyArray)
	end	
	update_hotkeys_js()
end


-- Called on unload
function script_unload()
end


-- Called when settings changed
function script_update(settings)
	debug = obs.obs_data_get_bool(settings, "debug")
end


-- Return description shown to user
function script_description()
	return "Control the display of Bible verses with hotkeys"
end


-- Define properties that user can change
function script_properties()
	local props = obs.obs_properties_create()
	obs.obs_properties_add_bool(props, "debug", "Debug")
	return props
end


-- Set default values
function script_defaults(settings)
	obs.obs_data_set_default_bool(settings, "debug", false)
end


-- Save additional data not set by user
function script_save(settings)
	for k, v in pairs(hotkeys) do
		local hotkeyArray = obs.obs_hotkey_save(hk[k])
		obs.obs_data_set_array(settings, k, hotkeyArray)
		obs.obs_data_array_release(hotkeyArray)
	end
end
