<template>
    <Page
      clearHistory="true"
      actionBarHidden="true">
      <TabView
            height="100%"
            androidTabsPosition="bottom"
            selected-tab-text-color="#53ba82"
            tab-text-font-size="15"
          >
            <TabViewItem title="To Do" text-transform="uppercase">
              <StackLayout
                orientation="vertical"
                width="100%"
                height="100%"
              >
                <GridLayout
                  columns="2*,*"
                  rows="*"
                  width="100%"
                  height="25%">
                  <TextField
                    v-model="textFieldValue"
                    col="0"
                    row="0"
                    hint="Type new task..."
                    editable="true"
                    @returnPress="onButtonTap"
                  />
                  <!-- Configures the text field and ensures that pressing Return on the keyboard produces the same result as tapping the button. -->
                  <Button
                    col="1"
                    row="0"
                    text="Add task"
                    @tap="onButtonTap"
                  />
                </GridLayout>

                <ListView
                  class="list-group"
                  for="(todo, index) in todos"
                  style="height:75%"
                  separator-color="transparent"
                  @itemTap="onItemTap">
                  <v-template>
                    <StackLayout orientation="horizontal">
                      <check-box 
                        class="check-box"
                        @tap="toggleTodo(index, todo.id)"
                        :checked="todo.completed"/>
                      <Label
                        :text="todo.title"
                        :textDecoration="todo.completed ? 'line-through':'none'"
                        class="list-group-item-heading"
                        text-wrap="true"/>
                    </StackLayout>
                  </v-template>
                </ListView>
              </StackLayout>
            </TabViewItem>

            <TabViewItem title="Completed" text-transform="uppercase">
              <ListView
                class="list-group"
                for="done in dones"
                style="height:75%"
                separator-color="transparent"
                @itemTap="onDoneTap"
              >
                <v-template>
                  <Label
                    id="completed-task"
                    :text="done.title"
                    class="list-group-item-heading"
                    text-wrap="true"
                  />
                </v-template>
              </ListView>
            </TabViewItem>
      </TabView>
    </Page>
</template>

<script >
import { CheckBox } from 'nativescript-checkbox';
import axios from 'axios';
  export default {
    data() {
      return {
        todos: [],
        textFieldValue: '',
      }
    },
    computed: {
      dones () {
        return this.todos.filter(todo => todo.completed === true);
      }
    },
    created () {
      axios.get("http://10.0.2.2:8000/api/todos") //_limit=5
      .then(res => {
        this.todos = res.data
        console.log(res.data)
      })
      .catch(err => console.log(err))
    },
    methods: {
      toggleTodo(index, id){
        axios.put(`http://10.0.2.2:8000/api/todos/${id}/complete`, {
          completed: this.todos[index].completed
        }) //_limit=5
        .then((res) => {
          this.todos[index].completed = res.data.completed;
        })
        .catch(err => console.log(err))
      },
      onItemTap(args) {
        console.log(`Item with index: ${args.index} tapped`);
        action('What do you want to do with this task?', 'Cancel', [
          'Mark completed',
          'Delete forever',
        ]).then(result => {
          console.log(result); // Logs the selected option for debugging.
          switch (result) {
            case 'Mark completed':
              this.dones.unshift(args.item); // Places the tapped active task at the top of the completed tasks.
              this.todos.splice(args.index, 1); // Removes the tapped active task.
              break;
            case 'Delete forever':
              this.todos.splice(args.index, 1); // Removes the tapped active task.
              break;
            case 'Cancel' || undefined: // Dismisses the dialog
              break;
          }
        });
      },
      onDoneTap: function(args) {
        action('What do you want to do with this task?', 'Cancel', [
          'Mark to do',
          'Delete forever',
        ]).then(result => {
          console.log(result); // Logs the selected option for debugging.
          switch (result) {
            case 'Mark to do':
              this.todos.unshift(args.item);
              // Places the tapped completed task at the top of the to do tasks.
              this.dones.splice(args.index, 1); // Removes the tapped completed task.
              break;
            case 'Delete forever':
              this.dones.splice(args.index, 1); // Removes the tapped completed task.
              break;
            case 'Cancel' || undefined: // Dismisses the dialog
              break;
          }
        });
      },
      onButtonTap() {
        // Prevent users from entering an empty string
        if (!this.textFieldValue) {
          alert(`Make sure it's not empty`)
          return;
        }

        console.log(`New task added: ${this.textFieldValue}.`);
        axios.post('http://10.0.2.2:8000/api/todos/',{
          title: this.textFieldValue,
          completed: false
        })
        .then(res => this.todos = [...this.todos, res.data])
        .catch(err => console.log(err));

        this.textFieldValue = '';
      },
  },
  }
</script>

<style scoped>
Label {
  text-align: center;
  font-size: 30;
  height: 100%;
}

TextField {
  font-size: 20;
  color: #53ba82;
  margin-top: 10;
  margin-bottom: 10;
  margin-right: 5;
  margin-left: 20;
  height: 60;
}

.check-box {
  margin: 0 auto;
}

button {
  font-size: 12;
  font-weight: bold;
  color: white;
  background-color: #53ba82;
  height: 40;
  margin-top: 10;
  margin-bottom: 10;
  margin-right: 10;
  margin-left: 10;
  border-radius: 20px;
}
#active-task {
  font-size: 20;
  font-weight: bold;
  color: #53ba82;
  margin-left: 20;
  padding-top: 5;
  padding-bottom: 10;
}
#completed-task {
  font-size: 20;
  color: #d3d3d3;
  margin-left: 20;
  padding-top: 5;
  padding-bottom: 10;
  text-decoration: line-through;
}
</style>
