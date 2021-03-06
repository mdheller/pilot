function(args) {
/*
is_app(true)
control_type("VB")
display_name("OSQuery control")
description("This will return the OSQuery control")
base_component_id("osquery_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Dev text",
            default:    "OSQuery",
            type:       "String"
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    100,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    40,
            type:       "Number"
        }
        ,
        {
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "osQuery",
            pre_snippet:    `await `,
            snippet:    `osQuery('SELECT COUNT(*) from processes;')`,
            name:       "Execute Command",
            type:       "Action"
        }
    ]
)//properties
logo_url("/driver_icons/osquery.png")
*/

    Vue.component("osquery_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (children.length == 0)">
        {{args.text}}
    </div>

    <div v-bind:style='"position:relative;width:100%;height:100%;border: 0px solid gray;background-color: "+    args["background_color"]  +  ";"'>
        <div style="position:absolute;top:0px">
            <slot v-bind:refresh='refresh'>
            </slot>
        </div>
    </div>
</div>`

        ,

        data: function() {
            return {
            }
        }

        ,

        mounted: async function() {
            registerComponent(this)

        }
        ,


        methods: {
            readFromTerminal: async function(cmdString) {
                var osQueryString = `osqueryi --json "${cmdString}"`

                var result = await callFunction(
                {
                    driver_name: "serverTerminalStuff",
                    method_name: "serverTerminalStuff"
                }
                ,
                {
                    cmd_string:    osQueryString
                })

                if (result) {
                    return result
                }
                return null
            }
            ,


            osQuery: async function(cmdString) {
                var qwe = await this.readFromTerminal(cmdString)
                return qwe
            }

        }




    })
}
