import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/todo'
import { addTodo } from '../store/todo/todoActions'
import { IState } from '../store/todo/type'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.todoReducer)
  useEffect(() => {
    dispatch(addTodo());
  }, );

  const pushEvent = useCallback(() => {
    console.log("click")
    dispatch(addTodo());
  }, [])
  return (
    <div>Welcome to Next.js!
      <div>
        <button onClick={pushEvent}>Push Button</button>
        <div>{data}</div>
        {/* <ul>{data.value.map((data)=>{ <li>{data}</li>})}</ul> */}
      </div>
    </div>
  )
}

export default Home
