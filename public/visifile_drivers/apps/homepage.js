async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
display_name("Homepage app")
description('Homepage app')
load_once_from_file(true)
read_only(true)
logo_url("https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/05/Best-Homepages--796x563.jpg")
*/
    var introa = ['homepage_1','homepage_2','homepage_3','homepage_4',
                    'homepage_5','homepage_6',"todo","form_subscribe_to_appshare","test"]
    await load("app_editor_3")
    var mm = null

    Vue.component('homepage', {

      template: `<div>
                    <div    style="position: sticky; left:0px; top:0px; height:70px; width: 100vw ;z-index: 200000;background-color: white;padding:0;margin:0;">
                    <h3 style="border:solid 1px;border-color: lightgray; padding: 14px; margin: 0px;font-family: Helvetica;">Appshare</h3>
                    </div>

      <div  class="container-fluid" style='position: relative; padding:20;margin:0; width: 95%;'>



                    <div v-bind:refresh='refresh'
                         ref='maingrid'
                         class="grid"
                         style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>





                                <div    v-for="item in intro_apps"
                                        class="grid-item"
                                        style="width: 30%;border-radius: 40px;background-color:white;border-width: 0px;margin:0px;padding:0px;margin-bottom: 40px;"
                                       >

                                       <div v-if="item.type == 'add'" >
                                        <div    style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'
                                                v-on:click='copyApp("todo")'>
                                           <h4>
                                            + Click this card to add a new app
                                           </h4>
                                           </div>
                                           </div>

                                   <div v-if="item.type == 'app'" >
                                       <div v-if="(edit_app == item.data.id)"
                                               style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:scroll; padding: 20px;">
                                               <div v-on:click='editApp($event,null)' class="btn-lg btn-danger" style='margin-bottom: 20px;'>Close</div>
                                               <component v-if='' :is='"app_editor_3"' v-bind:app_id='item.data.id'></component>
                                       </div>




                                    <div v-if='!isEditable(item.data.id)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                       <kbd >{{item.data.id}}</kbd>
                                       <component v-if='edit_app != item.data.id' :is='item.data.id'></component>
                                    </div>

                                    <div v-if='isEditable(item.data.id)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                        <kbd >{{item.data.id}}</kbd>
                                        <span class="badge badge-warning" >Editable</span>

                                        <img    v-bind:src='app_records[item.data.id].logo_url'
                                                style='width: 100%;'
                                                v-bind:alt='app_records[item.data.id].logo_url'
                                                v-on:click='editApp($event,item.data.id)'
                                                ></img>
                                    </div>


                                <div v-on:click='showMenu(item.data.id)' class="float-left">
                                ...
                                    <div v-bind:id='item.data.id + "_menu"' v-bind:style='"background-color: white; border: solid 1px lightgray;position:absolute; bottom:0px;width:250px;z-index:100000;display: " + ((show_menu == item.data.id)?"":"none")  +  ";border-radius: 20px; padding: 20px;"'>
                                        <ul class="nav flex-column">
                                        <li class="nav-item" v-if='!isEditable(item.data.id)'>
                                          <a  v-on:click='editApp($event,item.data.id)'
                                              class="nav-link active" href="#">View source</a>
                                        </li>

                                          <li class="nav-item" v-if='isEditable(item.data.id)'>
                                            <a  v-on:click='editApp($event,item.data.id)'
                                                class="nav-link active" href="#">Edit</a>
                                          </li>

                                        <li class="nav-item" >
                                          <a  v-on:click='editApp($event,null)'
                                              class="nav-link active" href="#">Close</a>
                                        </li>


                                        </ul>
                                    </div>
                                    </div>








                            </div>

                        </div>
                    </div>








                </div>
       </div>`
      ,


    data: function() {
        return {
                    apps: [],
                    intro_apps: [],
                    loaded_app: new Object(),
                    show_menu: null,
                    refresh: 0,
                    edit_app: null,
                    app_records: new Object(),
                    msnry: null
                }},

      mounted: async function() {
            mm = this

            this.msnry = new Masonry( mm.$refs.maingrid, {
              itemSelector: '.grid-item'
            });
            Vue.nextTick(() => {
                  this.msnry.reloadItems();
                  this.msnry.layout();
              });

           mm.addAdder()

           setTimeout(async function() {
               for (var rt=0; rt < introa.length; rt++) {
                   var appId = introa[rt]
                   mm.addApp(appId,-1)
               }
           },3000)


            mm.search()
      },
      methods: {
          addAdder: async function() {
                  mm.intro_apps.push( {
                                        type: "add",
                                      } )
                mm.refresh++
              },
          addApp: async function(baseComponentId, cardIndex) {
              if (baseComponentId) {
                  var app = {
                                        type: "app",
                                        data:
                                            {
                                                id: baseComponentId
                                            }
                                      }
                  if (cardIndex != -1) {
                    mm.intro_apps[cardIndex] =  app

                  } else {
                    mm.intro_apps.push( app  )
                  }
                  mm.loaded_app[baseComponentId] = true
                  var vv = await load(baseComponentId)
                  if (vv) {
                      mm.app_records[vv.base_component_id] = vv
                      mm.refresh++
                  }
                  setTimeout(function() {
                      mm.msnry.reloadItems();
                      mm.msnry.layout();
                  },50)
              }
          },
          copyApp: function(  baseComponentId ) {
              callDriverMethod( {driver_name: "copyApp",
                                 method_name: "copyAppshareApp"}
                                ,{
                                    base_component_id:    baseComponentId
                                 }
                          ,
                          function(result) {
                              //alert(JSON.stringify(result.value,null,2))
                              //var copLoc = "http://" +  useHostname + ":" + usePort + "/?goto=" + result.value.new_display_name .replaceAll(" ","%20")
                              //window.location.href = copLoc
                              mm.addApp(result.value.base_component_id, 0)

                          })
          },
          isEditable: function(baseComponentId) {
                if (this.app_records[baseComponentId]) {
                    if ((this.app_records[baseComponentId].read_write_status == null ) ||
                         (this.app_records[baseComponentId].read_write_status.indexOf("READ") == -1 ))   {
                         return true
                }

                }

               return false
          },
          editApp: async function(event,item) {
              event.stopPropagation()
              this.show_menu = null;
              this.edit_app = item;
          },
          showMenu: async function(item) {
            this.show_menu= item;
          },
          search: async function() {
               this.apps = await callApp({   driver_name: "systemFunctions3",  method_name:"get_public_apps_list"}, { }) }
          ,

      }
    })

}
