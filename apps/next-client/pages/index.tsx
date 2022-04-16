import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImageSlider from '../components/ImageSlider'
import Navbar from '../components/Navbar'
import { Product } from '../interfaces/Product'
import { productsActions, ProductState } from '../modules/reducers/productReducer'
import styles from './styles/index.module.css'


const Home: NextPage = () => {
  const dispatch = useDispatch();
  const data: Product = useSelector((state: ProductState) => state.data)
  const images: string[] = ['image1', 'image2', 'image3', 'image4'];

  useEffect(() => {
    dispatch(productsActions.getProducts());
  }, []);

  const pushEvent = useCallback(() => {
    dispatch(productsActions.getProducts());
  }, [])
  return (
    <div >
      <div>
        <ImageSlider data={images} />

      </div>
      <div>
        <button onClick={pushEvent}>Push Button</button>
        <Image src={data?.message} alt="test" width={500} height={500}></Image>s
        <div>{data?.message}
        </div>
      </div>
    </div>
  )
}

export default Home;
