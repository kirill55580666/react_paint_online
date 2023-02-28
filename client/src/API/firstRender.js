import axios from "axios";

const firstRender = (canvasRef, id) => {
    let ctx = canvasRef.current.getContext('2d')
    axios.get(`https://main--soft-crumble-e05c07.netlify.app/image?id=${id}`)
        .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
        })
}

export default firstRender;