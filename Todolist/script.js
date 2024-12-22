// DOM ELEMENTLERİNİN SEÇİMİ
const taskInput = document.getElementById("task"); // Görev metni girilen input alanını seçiyoruz.
const addTaskButton = document.getElementById("liveToastBtn"); // "Ekle" butonunu seçiyoruz.
const taskList = document.getElementById("list"); // Görevlerin listeleneceği <ul> öğesini seçiyoruz.

// LOCAL STORAGE'DAN GÖREVLERİ YÜKLEME
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // localStorage'da "tasks" anahtarında saklanan verileri JSON formatında alıyoruz. Veri yoksa boş bir dizi başlatıyoruz.
  tasks.forEach((task) => addTaskToDOM(task.text, task.completed));
  // Her bir görevi (text ve tamamlanma durumu) döngüyle DOM'a ekliyoruz.
}

// LOCAL STORAGE'A GÖREVLERİ KAYDETME
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#list li").forEach((taskItem) => {
    tasks.push({
      text: taskItem.textContent.replace("x", "").trim(), // Görev metnini "x" harfi olmadan alıyoruz.
      completed: taskItem.classList.contains("checked"), // Görevin tamamlanma durumunu kontrol ediyoruz.
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  // Görev listesini JSON formatında saklıyoruz.
}

// DOM'A GÖREV EKLEME
function addTaskToDOM(taskText, isCompleted = false) {
  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;
  // Yeni bir <li> elemanı oluşturuyoruz ve metin olarak görev adını ekliyoruz.

  if (isCompleted) {
    taskItem.classList.add("checked");
    // Eğer görev tamamlandıysa, "checked" sınıfını ekliyoruz.
  }

  const deleteButton = document.createElement("span");
  deleteButton.textContent = "x";
  deleteButton.className = "close";
  // Silme butonu oluşturuyoruz ve görsellik için "close" sınıfı ekliyoruz.

  deleteButton.addEventListener("click", () => {
    taskItem.remove(); // Görevi DOM'dan kaldırıyoruz.
    saveTasksToLocalStorage(); // Local Storage'ı güncelliyoruz.
    showToast("Görev silindi!", "error"); // Silme işlemi için bildirim gösteriyoruz.
  });

  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
  // Silme butonunu ve görevi listeye ekliyoruz.

  taskItem.addEventListener("click", () => {
    taskItem.classList.toggle("checked");
    // Görev üzerine tıklanırsa, tamamlanma durumunu değiştiriyoruz.
    saveTasksToLocalStorage();
    // Değişen durumu kaydediyoruz.
  });

  saveTasksToLocalStorage(); // Yeni görevi ekledikten sonra kaydediyoruz.
}

// YENİ GÖREV EKLEME
function addTask() {
  const taskText = taskInput.value.trim();
  // Kullanıcının girdiği metni alıyoruz ve baştaki/sondaki boşlukları temizliyoruz.

  if (taskText === "") {
    showToast("Listeye boş ekleme yapamazsınız!", "error");
    // Eğer metin boşsa, hata bildirimi gösteriyoruz.
    return;
  }

  addTaskToDOM(taskText);
  // Görevi DOM'a ekliyoruz.
  taskInput.value = "";
  // Input alanını temizliyoruz.
  showToast("Görev eklendi!", "success");
  // Başarı bildirimi gösteriyoruz.
}

// TOAST BİLDİRİMİ
function showToast(message, type) {
  const toastElement = document.querySelector(`.toast.${type}`);
  const toastBody = toastElement.querySelector(".toast-body");
  toastBody.textContent = message;
  // Bildirim içeriğini dinamik olarak değiştiriyoruz.

  $(toastElement).toast("show");
  // Bootstrap'in toast fonksiyonunu çalıştırarak bildirimi gösteriyoruz.
}

// EVENT LISTENER'LAR
addTaskButton.addEventListener("click", addTask);
// "Ekle" butonuna tıklama olayını dinliyoruz ve `addTask` fonksiyonunu çağırıyoruz.

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);
// Sayfa yüklendiğinde görevleri `localStorage`dan yüklemek için çalıştırıyoruz.
