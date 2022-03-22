import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Tasks from '../../components/Tasks';
import {Insert, findMany, Delete, UserInsertMany} from '../../utils/database';

const Home = () => {
  const [task, setTask] = useState('');
  const [taskItem, setTasItem] = useState([]);

  useEffect(() => {
    let task = [];
    (async function fetchApi() {
      await findMany('active_tasks')
        .then(res => {
          console.log('dff', res);
          res.map(item => {
            console.log(item);
            task.push([item.task]);
            setTasItem([...task]);
          });
        })
        .catch(err => {
          console.warn(err);
          return null;
        });
    })();
  }, []);

  const handleAddTask = async () => {
    Keyboard.dismiss();
    let taskr = [];
    setTasItem([...taskItem, task]);
    await Insert('active_tasks', '(task)', [task])
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.warn('fetching error ', err);
      });
    setTask('');
  };

  const completeTask = async index => {
    await Delete('active_tasks');
    let tasks = [...taskItem];
    tasks.splice(index, 1);
    console.log(tasks);
    setTasItem(tasks);
    //looping
    for (let i = 0; i < tasks.length; i++) {
      console.log(tasks[i].task);
      await Insert('active_tasks', '(task)', [tasks[i]])
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.warn('fetching error ', err);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <View style={styles.items}>
          {taskItem.map((item, index) => {
            return (
              <TouchableOpacity onPress={() => completeTask(index)}>
                <Tasks key={index} text={item} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/*   adding tasks */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Add task'}
          value={task}
          onChangeText={task => setTask(task)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
    borderColor: '#6e9eeb',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#6e9eeb',
    borderWidth: 1,
  },
  addText: {
    fontSize: 25,
    fontWeight: '500',
  },
});
