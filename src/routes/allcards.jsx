import MtGCard from "./card";
import uniqid from "uniqid";
import { Row } from "react-bootstrap";

function AllCards(props) {

    const rows = [];
    for (let i = 0; i < 20; i++) {
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        rows.push(<MtGCard key={uniqid()} onclick={props.handleClick}/>);
    }
    return (
        <div className="mt-4">
            <Row>
                {rows}
            </Row>
        </div>
    )
}

export default AllCards