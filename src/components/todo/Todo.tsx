"use client"
import styles from "./Todo.module.scss"
import React, { useState } from "react"
import { Tabs, TabList, Tab, Input, Button, Checkbox } from '@chakra-ui/react'

export default function Todo() {
    const [tasks, setTasks] = useState<{ id: number, text: string, completed: boolean }[]>([]);

    const [newTask, setNewTask] = useState("");
    const [tabIndex, setTabIndex] = useState(0);

    const handleAddTask = () => {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { id: tasks.length + 1, text: newTask, completed: false }])
            setNewTask("")
        }
    }

    const handleClear = () => {
        setTasks(tasks.filter(task => !task.completed));
    }

    const handleToggleTask = (id: number) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    }

    const filteredTasks = () => {
        switch (tabIndex) {
            case 0:
                return tasks
            case 1:
                return tasks.filter((task) => task.completed)
            case 2:
                return tasks.filter((task) => !task.completed)
            default:
                return tasks
        }
    }

    const handlePressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    }

    return (
        <div className={styles.todo__container}>
            <h1 className={styles.todo__title}>
                Todos
            </h1>
            <div className={styles.todo__input}>
                <Input
                    type="text"
                    placeholder="Add a new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyUp={handlePressKey}
                />
                <Button
                    onClick={handleAddTask}>
                    Add
                </Button>
            </div>
            <Tabs
                onChange={(index) => setTabIndex(index)}
                variant='enclosed'
            >
                <TabList>
                    <Tab>
                        All
                    </Tab>
                    <Tab>
                        Completed
                    </Tab>
                    <Tab>
                        Active
                    </Tab>
                </TabList>
            </Tabs>
            <ul className={styles.todo__list}>
                {filteredTasks().map((task) => (
                    <li
                        className={styles.todo__list_item}
                        key={task.id}
                        data-testid='todo-item'
                    >
                        <Checkbox
                            id={`task-${task.id}`}
                            isChecked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                        />
                        <label
                            data-testid='todo-title'
                            htmlFor={`task-${task.id}`}
                            className={!task.completed ? `${styles.todo__list_activeItem}` : `${styles.todo__list_completeItem}`}
                        >
                            {task.text}
                        </label>
                    </li>
                ))}
            </ul>
            <div className={styles.todo__desc}>
                <p
                    className={styles.todo__desc_text}
                    data-testid='todo-count'
                >
                    {`${tasks.filter(task => !task.completed).length} tasks left`}
                </p>
                <Button
                    isDisabled={tasks.filter(task => task.completed).length > 0 ? false : true}
                    onClick={handleClear}
                >
                    Clear completed
                </Button>
            </div>
        </div>
    )
}