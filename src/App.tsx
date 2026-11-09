import { useMemo, useState } from "react";

const asset = (name: string) => `/assets/${name}`;

type Employee = {
  code: string;
  name: string;
  role: string;
  inbound: string;
  outbound: string;
  verified: boolean;
  disabled?: boolean;
};

const initialEmployees: Employee[] = [
  {
    code: "123456",
    name: "Nguyễn Văn A",
    role: "Nhân viên bán hàng",
    inbound: "400",
    outbound: "600",
    verified: true,
  },
  {
    code: "234567",
    name: "Huỳnh Văn B",
    role: "RMM",
    inbound: "600",
    outbound: "600",
    verified: true,
  },
  {
    code: "345678",
    name: "Đỗ Quý C",
    role: "Supervisor",
    inbound: "400",
    outbound: "600",
    verified: false,
    disabled: true,
  },
  {
    code: "456789",
    name: "Võ Tấn D",
    role: "Technical Baker",
    inbound: "400",
    outbound: "600",
    verified: true,
  },
];

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return <img src={asset(name)} width={size} height={size} alt="" aria-hidden="true" />;
}

function ActionButton({
  children,
  icon,
  variant = "outline",
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  icon: string;
  variant?: "primary" | "outline" | "disabled";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      className={`action-button ${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <Icon name={icon} />
      <span>{children}</span>
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "checked" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

export default function App() {
  const [codeQuery, setCodeQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [defaultInbound, setDefaultInbound] = useState("400");
  const [defaultOutbound, setDefaultOutbound] = useState("600");
  const [employees, setEmployees] = useState(initialEmployees);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [savedSignature, setSavedSignature] = useState(
    JSON.stringify({ defaultInbound: "400", defaultOutbound: "600", employees: initialEmployees }),
  );

  const currentSignature = JSON.stringify({ defaultInbound, defaultOutbound, employees });
  const dirty = currentSignature !== savedSignature;

  const visibleEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.code.toLowerCase().includes(appliedCode.toLowerCase()) &&
          employee.name.toLocaleLowerCase("vi").includes(appliedName.toLocaleLowerCase("vi")),
      ),
    [employees, appliedCode, appliedName],
  );

  const resetAll = () => {
    setCodeQuery("");
    setNameQuery("");
    setAppliedCode("");
    setAppliedName("");
    setDefaultInbound("400");
    setDefaultOutbound("600");
    setEmployees(initialEmployees);
    setPage(1);
  };

  const updateEmployee = (index: number, patch: Partial<Employee>) => {
    const employeeCode = visibleEmployees[index]?.code;
    setEmployees((current) =>
      current.map((employee) =>
        employee.code === employeeCode ? { ...employee, ...patch } : employee,
      ),
    );
  };

  return (
    <div className="app-shell">
      <header className="top-navigation">
        <img className="top-navigation-art" src={asset("1eca3.png")} alt="" />
        <nav className="breadcrumbs" aria-label="Đường dẫn">
          <button>Cài đặt và Quản trị hệ thống</button>
          <span>&gt;</span>
          <button>Tham số</button>
          <span>&gt;</span>
          <strong>Kiểm tra khoảng cách</strong>
        </nav>
      </header>

      <aside className="side-navigation" aria-label="Điều hướng chính">
        <img src={asset("6f34e.png")} alt="" />
      </aside>

      <main className="main-card">
        <div className="tabs" role="tablist" aria-label="Cài đặt khoảng cách">
          {["Kiểm Soát Khoảng Cách", "Cảnh báo chưa viếng thăm"].map((tab, index) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === index}
              className={activeTab === index ? "active" : ""}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="top-actions">
          <ActionButton icon="41fbc.svg" onClick={resetAll}>
            Đặt Lại
          </ActionButton>
          <ActionButton
            icon="5ed15.svg"
            variant={dirty ? "outline" : "disabled"}
            disabled={!dirty}
            onClick={() => setSavedSignature(currentSignature)}
          >
            Lưu lại
          </ActionButton>
        </div>

        <form
          className="search-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedCode(codeQuery);
            setAppliedName(nameQuery);
          }}
        >
          <div className="search-fields">
            <label>
              <span>Mã Nhân Viên</span>
              <input
                value={codeQuery}
                onChange={(event) => setCodeQuery(event.target.value)}
                placeholder="Nhập mã nhân viên"
              />
            </label>
            <label>
              <span>Tên Nhân Viên</span>
              <input
                value={nameQuery}
                onChange={(event) => setNameQuery(event.target.value)}
                placeholder="Nhập tên nhân viên"
              />
            </label>
          </div>
          <div className="search-actions">
            <ActionButton icon="d7c1e.svg" variant="primary" type="submit">
              Tìm kiếm
            </ActionButton>
            <ActionButton
              icon="ddf39.svg"
              onClick={() => {
                setCodeQuery("");
                setNameQuery("");
                setAppliedCode("");
                setAppliedName("");
              }}
            >
              Làm Mới
            </ActionButton>
          </div>
        </form>

        <div className="defaults-row">
          <label>
            <span>
              Bán Kính Vào Điểm Khách Hàng Mặc Định Toàn Hệ Thống (M)<b>*</b>
            </span>
            <input
              value={defaultInbound}
              onChange={(event) => setDefaultInbound(event.target.value)}
            />
          </label>
          <label>
            <span>
              Bán Kính Ra Điểm Khách Hàng Mặc Định Toàn Hệ Thống (M)<b>*</b>
            </span>
            <input
              value={defaultOutbound}
              onChange={(event) => setDefaultOutbound(event.target.value)}
            />
          </label>
        </div>

        <section className="table-section" aria-label="Danh sách nhân viên">
          <div className="table-toolbar">
            <div className="entry-summary">
              <span>Hiển thị 1 đến 20 trên tổng số 100 mục</span>
              <label>
                Hiển thị
                <span className="page-size">
                  20 <Icon name="8515c.svg" size={16} />
                </span>
                Mục
              </label>
            </div>
            <div className="pagination" aria-label="Phân trang">
              <button onClick={() => setPage(1)} aria-label="Trang đầu">
                <Icon name="d02aa.svg" size={20} />
              </button>
              <button onClick={() => setPage(Math.max(1, page - 1))} aria-label="Trang trước">
                <Icon name="c2a2e.svg" size={20} />
              </button>
              {[1, 2, 3].map((number) => (
                <button
                  key={number}
                  className={page === number ? "current" : ""}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(3, page + 1))} aria-label="Trang sau">
                <Icon name="9f390.svg" size={20} />
              </button>
              <button onClick={() => setPage(3)} aria-label="Trang cuối">
                <Icon name="ce6a9.svg" size={20} />
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Mã Nhân Viên</th>
                  <th>Tên Nhân Viên</th>
                  <th>Vai Trò</th>
                  <th>Bán Kính Vào Điểm Khách Hàng Riêng (M)</th>
                  <th>Bán Kính Ra Điểm Khách Hàng Riêng (M)</th>
                  <th>Xác Minh Khoảng Cách</th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployees.map((employee, index) => (
                  <tr key={employee.code}>
                    <td>{employee.code}</td>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>
                      <input
                        aria-label={`Bán kính vào của ${employee.name}`}
                        disabled={employee.disabled}
                        value={employee.inbound}
                        onChange={(event) => updateEmployee(index, { inbound: event.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Bán kính ra của ${employee.name}`}
                        disabled={employee.disabled}
                        value={employee.outbound}
                        onChange={(event) =>
                          updateEmployee(index, { outbound: event.target.value })
                        }
                      />
                    </td>
                    <td>
                      <Toggle
                        checked={employee.verified}
                        label={`Xác minh khoảng cách cho ${employee.name}`}
                        onChange={() => updateEmployee(index, { verified: !employee.verified })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
