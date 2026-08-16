import { useEffect, useState } from "react"
import LeftBar from "./components/LeftBar"
import RightHalf from "./components/RightHalf"

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("taskify-tasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (error) {
      console.error("Failed to load tasks:", error)
      return []
    }
  })

  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("Work")
  const [searchText, setSearchText] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ==========================================
  // SAVE TASKS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "taskify-tasks",
      JSON.stringify(tasks)
    )
  }, [tasks])

  // ==========================================
  // ADD TASK
  // ==========================================

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      category: selectedCategory,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [
      ...prev,
      newTask,
    ])
  }

  // ==========================================
  // COMPLETE / UNCOMPLETE
  // ==========================================

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    )
  }

  // ==========================================
  // DELETE TASK
  // ==========================================

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    )
  }

  // ==========================================
  // TOGGLE PRIORITY
  // ==========================================

  const togglePriority = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              priority: !task.priority,
            }
          : task
      )
    )
  }

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setSidebarOpen(false)
  }

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setActiveFilter("All")
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-950">

      <div className="flex min-h-screen w-full">

        {/* ======================================
            MOBILE BACKDROP
        ====================================== */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0
              z-40
              cursor-default
              bg-black/60
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}

        {/* ======================================
            SIDEBAR
        ====================================== */}

        <aside
          className={`
            fixed
            left-0
            top-0
            z-50
            h-screen
            w-[282px]
            transform
            transition-transform
            duration-300
            ease-in-out

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }

            lg:sticky
            lg:top-0
            lg:h-screen
            lg:shrink-0
            lg:translate-x-0
          `}
        >
          <LeftBar
            tasks={tasks}
            activeFilter={activeFilter}
            selectedCategory={selectedCategory}
            onFilterChange={handleFilterChange}
            onCategoryChange={handleCategoryChange}
            onClose={() =>
              setSidebarOpen(false)
            }
          />
        </aside>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <main className="min-w-0 flex-1">

          <RightHalf
            tasks={tasks}
            activeFilter={activeFilter}
            selectedCategory={selectedCategory}
            searchText={searchText}
            setSearchText={setSearchText}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onTogglePriority={togglePriority}
            onFilterChange={handleFilterChange}
            onOpenSidebar={() =>
              setSidebarOpen(true)
            }
          />

        </main>

      </div>

    </div>
  )
}

export default App