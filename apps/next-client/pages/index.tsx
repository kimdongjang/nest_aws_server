import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Product } from '../interfaces/Product'
import { productsActions, RootState } from '../modules/reducers/productReducer'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const data:Product = useSelector((state: RootState) => state.data)
  
  useEffect(() => {
    dispatch(productsActions.getProducts());
  }, []);

  const pushEvent = useCallback(() => {
    dispatch(productsActions.getProducts());
  }, [])
  return (
    <div>Welcome to Next.js!
      <div>
        <button onClick={pushEvent}>Push Button</button>
        <Image src={data?.message} alt="test" width={500} height={500}></Image>
        <div>{data?.message}
        </div>
      </div>
    </div>
  )
}

export default Home;
