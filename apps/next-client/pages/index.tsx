import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/todo'
import { addTodo } from '../store/todo/todoActions'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state: RootState) => state.todoReducer)
  useEffect(() => {

  }, []);

  const pushEvent = useCallback(() => {
    dispatch(addTodo({ value: "test" }));
  }, [])
  return (
    <div>Welcome to Next.js!
      <div>
        <button onClick={pushEvent}>Push Button</button>
      </div>
    </div>
  )
}

export default Home
