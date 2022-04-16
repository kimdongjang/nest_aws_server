import React, { FC, useEffect, useRef, useState } from 'react';
import styles from '../styles/imageSlider.module.css'

interface Props {
    data: string[];
}

const ImageSlider: FC<Props> = ({ data }) => {
    console.log(data);
    const ref = useRef<HTMLDivElement>(null);

    const [imageList, setImageList] = useState([data[data?.length - 1], ...data, data[0],]);
    const [currentImgIndex, setCurrentImgIndex] = useState(1);

    const [touch, setTouch] = useState({
        start: 0,
        end: 0,
    });

    const [style, setStyle] = useState({
        transform: `translateX(-${currentImgIndex}00%)`,
        transition: `all 0.4s ease-in-out`,
    });


    const nextImage = () => {
        setCurrentImgIndex(currentImgIndex + 1);
        setStyle({
            transform: `translateX(-${currentImgIndex}00%)`,
            transition: `all 0.4s ease-in-out`,
        })
    }
    useEffect(() => {
        if (currentImgIndex === 0) {
            setCurrentImgIndex(imageList.length - 2);
            setTimeout(function () {
                setStyle({
                    transform: `translateX(-${imageList.length - 2}00%)`,
                    transition: '0ms',
                });
            }, 500);
        }

    }, [])

    return (
        <div className={styles.imageSlideWrap}>
            <div className={styles.imageSliderContainer}>
                <div>
                    {imageList?.map((image, i) => {
                        return (
                            <img key={i} src={"../static/images/" + image} className={styles.imageContent} />
                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default ImageSlider;