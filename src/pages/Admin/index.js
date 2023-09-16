import { useEffect, useState } from "react";
import "./admin.css";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { USER_KEY } from "../../constants";

function Admin() {
  const [tarefaInput, setTarefaInput] = useState("");
  const [user, setUser] = useState({});
  const [tarefas, setTarefas] = useState([]);
  const [edit, setEdit] = useState({});

  function loadInfo() {
    const userDetail = localStorage.getItem(`${USER_KEY}`);
    setUser(JSON.parse(userDetail));

    if (userDetail) {
      const userInfo = JSON.parse(userDetail);

      const tarefaRef = collection(db, "tarefas");
      const q = query(
        tarefaRef,
        orderBy("created", "desc"),
        where("userUid", "==", userInfo?.uid)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            userUid: doc.data().userUid,
          });
        });

        setTarefas(lista);
      });
    }
  }

  useEffect(() => {
    loadInfo();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (tarefaInput) {
      if (edit?.id) {
        handleUpdateTarefa();
        return;
      }

      await addDoc(
        collection(db, "tarefas", {
          tarefa: tarefaInput,
          created: new Date(),
          userUid: user?.uid,
        })
      ).then(() => {
        setTarefaInput("");
      });
    }
  }

  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit.id);
    await updateDoc(docRef, {
      tarefa: tarefaInput,
    })
      .then(() => {
        setTarefaInput("");
        setEdit({});
      })
      .catch(() => {
        setTarefaInput("");
        setEdit({});
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function deleteTarefa(idTarefa) {
    const docRef = doc(db, "tarefas", idTarefa);
    await deleteDoc(docRef);
  }

  function editarTarefa(item) {
    setTarefaInput(item.tarefa);
    setEdit(item);
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas:</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
        />
        {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
        <button className="btn-register" type="submit">
          Registrar tarefa
        </button>
      </form>
      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>
          <div>
            <button onClick={() => editarTarefa(item)}>Editar</button>
            <button
              onClick={() => deleteTarefa(item.id)}
              className="btn-delete"
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default Admin;
