import { useParams } from "react-router-dom";


function Details(){
    const {id} = useParams();
    return (
        <h1>Детали для пользователя {id}</h1>
    )
}

export default Details;