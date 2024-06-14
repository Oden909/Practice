document.getElementById('fetchUrls').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    try {
        const response = await fetch('/get-urls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keyword })
        });

        const urls = await response.json();
        if (response.ok) {
            displayUrls(urls);
        } else {
            alert(urls.error);
        }
    } catch (error) {
        alert('Ошибка при получении URL');
    }
});
function displayUrls(urls) {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    urls.forEach(url => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = 'Установить контент';
        button.classList.add('button'); // Добавление класса для стилизации
        button.onclick = () => downloadContent(url);
        li.textContent = url;
        li.appendChild(button);
        urlList.appendChild(li);
    });
}
async function downloadContent(url) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.display = 'block';
    progressBar.value = 0;
    try {
        const response = await fetch('/download-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem(url, JSON.stringify(result.content, null, 2));
            displayContentList();
        } else {
            alert(result.error);
        }
    } catch (error) {
        alert('Ошибка скачивания контента');
    } finally {
        progressBar.style.display = 'none';
    }
}
function displayContentList() {
    const contentList = document.getElementById('contentList');
    contentList.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const url = localStorage.key(i);
        const content = JSON.parse(localStorage.getItem(url));
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = 'Просмотреть контент';
        button.classList.add('button'); // Добавление класса для стилизации
        button.onclick = () => {
            const contentDisplay = document.getElementById('contentDisplay');
            contentDisplay.textContent = JSON.stringify(content, null, 2);
            contentDisplay.style.display = 'block';
        };
        li.textContent = url;
        li.appendChild(button);
        contentList.appendChild(li);
    }
}
displayContentList();
