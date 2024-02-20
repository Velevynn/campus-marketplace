import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.characterData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.title}</td>
        <td>{row.description}</td>
        <td>${row.price}</td>
        <td>
          <button onClick={() => props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  console.log(props.characterData);

  return (
    <div>
      <h2>Listings</h2>
      <table>
        <TableHeader />
        <TableBody
          characterData={props.characterData}
          removeCharacter={props.removeCharacter}
        />
      </table>
    </div>
  );
}

export default Table;
