import { useState, useEffect } from "react";
import "./Subjects.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, DialogContentText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";

export default function Subjects  () {
  const [headers, setHeaders] = useState([]);
  const [marks, setmarks] = useState([]);
  const [mark1, setmark1] = useState();
  const [mark2, setmark2] = useState();
  const [mark3, setmark3] = useState();
  const [mark4, setmark4] = useState();
  const [mark5, setmark5] = useState();
  const [rollno, setrollno] = useState();

  function entermarks(event) {
    event.preventDefault();
    console.log(mark1, mark2, mark3, mark4, mark5);
    const newTotal =
      parseInt(mark1 || 0) +
      parseInt(mark2 || 0) +
      parseInt(mark3 || 0) +
      parseInt(mark4 || 0) +
      parseInt(mark5 || 0);
    setmarks([...marks, [rollno, mark1, mark2, mark3, mark4, mark5, newTotal]]);
    handleSubmit();
    fetchMarks();
  }

  const handleSubmit = async () => {
    try {
      const total =
        parseInt(mark1 || 0) +
        parseInt(mark2 || 0) +
        parseInt(mark3 || 0) +
        parseInt(mark4 || 0) +
        parseInt(mark5 || 0);
      const res = await fetch("http://localhost:7000/add-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sub1: mark1,
          Sub2: mark2,
          Sub3: mark3,
          Sub4: mark4,
          Sub5: mark5,
          Tot: total,
          Rno: rollno,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error("HTTP Error");
      }
      console.log("Added successfully");
      setmark1("");
      setmark2("");
      setmark3("");
      setmark4("");
      setmark5("");
      setrollno("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await fetch("http://localhost:7000/fetch-marks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched Data:", data);
      if (!res.ok) {
        throw new Error("HTTP Error");
      }
      if (Array.isArray(data.marks)) {
        setmarks(
          data.marks.map((mark) => [
            mark.rollno,
            mark.subject1,
            mark.subject2,
            mark.subject3,
            mark.subject4,
            mark.subject5,
            mark.total,
          ])
        );
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const deleteMarks = async (rowIndex) => {
    const res = await fetch("http://localhost:7000/fetch-marks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const id = data.marks[rowIndex].id;
    try {
      console.log(id);
      const res = await fetch(`http://localhost:7000/delete-marks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "HTTP Error");
      }
      console.log("Deleted successfully");
      setmarks((prevMarks) => prevMarks.filter((_, index) => index !== rowIndex));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const [vrollno, setVrollno] = useState();
  const [vmark1, setVmark1] = useState();
  const [vmark2, setVmark2] = useState();
  const [vmark3, setVmark3] = useState();
  const [vmark4, setVmark4] = useState();
  const [vmark5, setVmark5] = useState();
  const [opendialog, setOpendialog] = useState(false);
  const [eddit, setEddit] = useState();

  const edit = async (eid) => {
    const res = await fetch("http://localhost:7000/fetch-marks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const editid = data.marks[eid].id;
    setEddit(editid);
    setOpendialog(true);
    setVrollno(data.marks[eid].rollno);
    setVmark1(data.marks[eid].subject1);
    setVmark2(data.marks[eid].subject2);
    setVmark3(data.marks[eid].subject3);
    setVmark4(data.marks[eid].subject4);
    setVmark5(data.marks[eid].subject5);
  };

  const editmarks = async () => {
    console.log(eddit);
    try {
      const newtotal =
        parseInt(vmark1 || 0) +
        parseInt(vmark2 || 0) +
        parseInt(vmark3 || 0) +
        parseInt(vmark4 || 0) +
        parseInt(vmark5 || 0);

      const res = await fetch(`http://localhost:7000/edit-marks/${eddit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sub1: vmark1,
          Sub2: vmark2,
          Sub3: vmark3,
          Sub4: vmark4,
          Sub5: vmark5,
          Tot: newtotal,
          Rno: vrollno,
        }),
      });
      console.log(vmark1, vmark2, vmark3, vmark4, vmark5, newtotal);
      if (!res.ok) {
        throw new Error("HTTP Error");
      }
      console.log("Edited successfully");
      fetchMarks();
      closedialog();
    } catch (error) {
      console.log(error);
    }
  };

  function closedialog() {
    setOpendialog(false);
  }

  const [opendelete, setOpendelete] = useState(false);
  const [iddelete, setIddelete] = useState(0);

  function opendeletedialog(rowIndex) {
    setOpendelete(true);
    setIddelete(rowIndex);
  }

  function closedeletedialog() {
    setOpendelete(false);
  }

  function confirmdelete() {
    deleteMarks(iddelete);
    setOpendelete(false);
  }

  return (
    <div className="maincontentmarks">
      <div className="editbox">
        <Dialog open={opendialog} onClose={closedialog} fullWidth maxWidth="xs">
          <DialogTitle textAlign={"center"} fontSize={25}>
            Edit Marks
          </DialogTitle>
          <DialogContent>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <TextField
                id="outlined-basic"
                disabled
                value={vrollno}
                onChange={(e) => setVrollno(e.target.value)}
                label="Rollno"
                variant="outlined"
                className="textfield"
              />
              <TextField
                id="outlined-basic"
                value={vmark1}
                onChange={(e) => setVmark1(e.target.value)}
                label="Subject 1"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                value={vmark2}
                onChange={(e) => setVmark2(e.target.value)}
                label="Subject 2"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                value={vmark3}
                onChange={(e) => setVmark3(e.target.value)}
                label="Subject 3"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                value={vmark4}
                onChange={(e) => setVmark4(e.target.value)}
                label="Subject 4"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                value={vmark5}
                onChange={(e) => setVmark5(e.target.value)}
                label="Subject 5"
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={closedialog}>
              Close
            </Button>
            <Button onClick={editmarks} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="deletebox">
        <Dialog open={opendelete} onClose={closedeletedialog} fullWidth maxWidth="xs">
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete this student mark?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={closedeletedialog}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={confirmdelete}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <h1>Mark Entry Portal</h1>
      <div className="inputform">
        <form action="" onSubmit={entermarks}>
          <p>
            <label htmlFor="" className="label1">
              Roll no:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setrollno(e.target.value);
              }}
              value={rollno}
              required
            />
            <br />
          </p>
          <p>
            <label htmlFor="" className="label1">
              Subject 1:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setmark1(e.target.value);
              }}
              value={mark1}
              required
            />
            <br />
          </p>
          <p>
            <label htmlFor="" className="label1">
              Subject 2:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setmark2(e.target.value);
              }}
              value={mark2}
              required
            />
            <br />
          </p>
          <p>
            <label htmlFor="" className="label1">
              Subject 3:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setmark3(e.target.value);
              }}
              value={mark3}
              required
            />
            <br />
          </p>
          <p>
            <label htmlFor="" className="label1">
              Subject 4:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setmark4(e.target.value);
              }}
              value={mark4}
              required
            />
            <br />
          </p>
          <p>
            <label htmlFor="" className="label1">
              Subject 5:
            </label>
            <input
              type="number"
              onChange={(e) => {
                setmark5(e.target.value);
              }}
              value={mark5}
              required
            />
            <br />
          </p>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="markstable">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll NO</TableCell>
                <TableCell>Subject 1</TableCell>
                <TableCell>Subject 2</TableCell>
                <TableCell>Subject 3</TableCell>
                <TableCell>Subject 4</TableCell>
                <TableCell>Subject 5</TableCell>
                <TableCell>Total</TableCell>
                <TableCell colSpan="2">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marks.map((marks, rowIndex) => (
                <TableRow key={rowIndex}>
                  {marks.map((mark, colIndex) => (
                    <TableCell key={colIndex}>{mark}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => opendeletedialog(rowIndex)}>
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => edit(rowIndex)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
