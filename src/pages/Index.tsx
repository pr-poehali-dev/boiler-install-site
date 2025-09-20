import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useState } from "react";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const allData = [
    // Установленные котлы
    {
      id: "BLR-001",
      address: "ул. Ленина, 15",
      client: {
        fullName: "Смирнов Олег Петрович",
        phone: "+7 (999) 111-11-11",
        email: "smirnov@example.com",
        passport: "1111 111111",
        inn: "111111111111"
      },
      status: "active",
      temp: 72,
      lastService: "2024-08-15",
      boilerType: "Котел газовый 24кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-01-10",
      plannedDate: "2024-02-15",
      documents: ["warranty.pdf", "manual.pdf"],
      photos: ["completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "BLR-002",
      address: "пр. Победы, 32",
      client: {
        fullName: "Волкова Елена Александровна",
        phone: "+7 (999) 222-22-22",
        email: "volkova@example.com",
        passport: "2222 222222",
        inn: "222222222222"
      },
      status: "maintenance",
      temp: 45,
      lastService: "2024-09-01",
      boilerType: "Котел конденсационный 20кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-02-05",
      plannedDate: "2024-03-12",
      documents: ["warranty.pdf", "service_log.pdf"],
      photos: ["maintenance_1.jpg"]
    },
    {
      id: "BLR-003",
      address: "ул. Гагарина, 8",
      client: {
        fullName: "Морозов Андрей Викторович",
        phone: "+7 (999) 333-33-33",
        email: "morozov@example.com",
        passport: "3333 333333",
        inn: "333333333333"
      },
      status: "offline",
      temp: 0,
      lastService: "2024-07-20",
      boilerType: "Котел электрический 18кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-01-15",
      plannedDate: "2024-02-28",
      documents: ["warranty.pdf"],
      photos: ["offline_issue.jpg"]
    },
    {
      id: "BLR-004",
      address: "ул. Мира, 45",
      client: {
        fullName: "Федоров Дмитрий Сергеевич",
        phone: "+7 (999) 444-44-44",
        email: "fedorov@example.com",
        passport: "4444 444444",
        inn: "444444444444"
      },
      status: "active",
      temp: 68,
      lastService: "2024-08-28",
      boilerType: "Котел газовый 30кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-03-01",
      plannedDate: "2024-04-10",
      documents: ["warranty.pdf", "manual.pdf", "certificate.pdf"],
      photos: ["completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "BLR-005",
      address: "ул. Советская, 12",
      client: {
        fullName: "Кузнецова Ирина Владимировна",
        phone: "+7 (999) 555-55-55",
        email: "kuznetsova@example.com",
        passport: "5555 555555",
        inn: "555555555555"
      },
      status: "warning",
      temp: 85,
      lastService: "2024-09-10",
      boilerType: "Котел комбинированный 25кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-02-15",
      plannedDate: "2024-03-25",
      documents: ["warranty.pdf", "service_alert.pdf"],
      photos: ["warning_temp.jpg"]
    },
    // Новые установки в процессе
    {
      id: "INS-001",
      address: "ул. Новая, 25",
      client: {
        fullName: "Иванов Иван Иванович",
        phone: "+7 (999) 123-45-67",
        email: "ivanov@example.com",
        passport: "1234 567890",
        inn: "123456789012"
      },
      status: "quotation",
      orderDate: "2024-09-15",
      plannedDate: "2024-09-25",
      boilerType: "Котел газовый 24кВт",
      progress: 10,
      type: "installation",
      documents: ["quotation.pdf"],
      photos: []
    },
    {
      id: "INS-002",
      address: "ул. Строителей, 12",
      client: {
        fullName: "Петрова Марина Сергеевна",
        phone: "+7 (999) 234-56-78",
        email: "petrova@example.com",
        passport: "2345 678901",
        inn: "234567890123"
      },
      status: "production",
      orderDate: "2024-09-10",
      plannedDate: "2024-09-22",
      boilerType: "Котел конденсационный 28кВт",
      progress: 30,
      type: "installation",
      documents: ["contract.pdf", "technical_spec.pdf"],
      photos: []
    },
    {
      id: "INS-003",
      address: "ул. Парковая, 67",
      client: {
        fullName: "Николаев Сергей Михайлович",
        phone: "+7 (999) 666-66-66",
        email: "nikolaev@example.com",
        passport: "6666 666666",
        inn: "666666666666"
      },
      status: "delivery",
      orderDate: "2024-09-08",
      plannedDate: "2024-09-20",
      boilerType: "Котел электрический 22кВт",
      progress: 60,
      type: "installation",
      documents: ["contract.pdf", "passport_copy.pdf"],
      photos: ["site_before_1.jpg"]
    },
    {
      id: "INS-004",
      address: "пр. Мира, 88",
      client: {
        fullName: "Сидоров Петр Алексеевич",
        phone: "+7 (999) 345-67-89",
        email: "sidorov@example.com",
        passport: "3456 789012",
        inn: "345678901234"
      },
      status: "installation",
      orderDate: "2024-09-05",
      plannedDate: "2024-09-20",
      boilerType: "Котел электрический 15кВт",
      progress: 85,
      type: "installation",
      documents: ["contract.pdf", "installation_permit.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "installation_2.jpg"]
    },
    {
      id: "INS-005",
      address: "ул. Садовая, 45",
      client: {
        fullName: "Козлова Анна Дмитриевна",
        phone: "+7 (999) 456-78-90",
        email: "kozlova@example.com",
        passport: "4567 890123",
        inn: "456789012345"
      },
      status: "testing",
      orderDate: "2024-08-20",
      plannedDate: "2024-09-15",
      boilerType: "Котел комбинированный 32кВт",
      progress: 95,
      type: "installation",
      documents: ["contract.pdf", "installation_act.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "testing_1.jpg"]
    },
    {
      id: "INS-006",
      address: "ул. Весенняя, 18",
      client: {
        fullName: "Романов Алексей Игоревич",
        phone: "+7 (999) 777-77-77",
        email: "romanov@example.com",
        passport: "7777 777777",
        inn: "777777777777"
      },
      status: "completed",
      orderDate: "2024-08-15",
      plannedDate: "2024-09-10",
      boilerType: "Котел газовый 26кВт",
      progress: 100,
      type: "installation",
      documents: ["contract.pdf", "completion_act.pdf", "warranty.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "INS-007",
      address: "пр. Космонавтов, 15",
      client: {
        fullName: "Белова Татьяна Николаевна",
        phone: "+7 (999) 888-88-88",
        email: "belova@example.com",
        passport: "8888 888888",
        inn: "888888888888"
      },
      status: "canceled",
      orderDate: "2024-09-12",
      plannedDate: "2024-09-30",
      boilerType: "Котел конденсационный 30кВт",
      progress: 5,
      type: "installation",
      documents: ["quotation.pdf", "cancel_notice.pdf"],
      photos: []
    }
  ];

  // Фильтрация данных
  const filteredData = allData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boilerType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "maintenance": return "bg-blue-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активен";
      case "warning": return "Предупреждение";
      case "maintenance": return "Обслуживание";
      case "offline": return "Отключен";
      default: return "Неизвестно";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "maintenance": return "bg-blue-500";
      case "offline": return "bg-red-500";
      case "quotation": return "bg-cyan-500";
      case "production": return "bg-orange-500";
      case "delivery": return "bg-indigo-500";
      case "installation": return "bg-purple-500";
      case "testing": return "bg-amber-500";
      case "completed": return "bg-green-600";
      case "canceled": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активен";
      case "warning": return "Предупреждение";
      case "maintenance": return "Обслуживание";
      case "offline": return "Отключен";
      case "quotation": return "Коммерческое предложение";
      case "production": return "Производство";
      case "delivery": return "Доставка";
      case "installation": return "Монтаж";
      case "testing": return "Тестирование";
      case "completed": return "Завершен";
      case "canceled": return "Отменен";
      default: return "Неизвестно";
    }
  };

  const activeBoilers = allData.filter(b => b.status === "active").length;
  const maintenanceBoilers = allData.filter(b => b.status === "maintenance").length;
  const warningBoilers = allData.filter(b => b.status === "warning").length;
  const offlineBoilers = allData.filter(b => b.status === "offline").length;
  const completedInstallations = allData.filter(b => b.status === "completed").length;
  const activeInstallations = allData.filter(b => b.type === "installation" && !['completed', 'canceled'].includes(b.status)).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Icon name="Flame" size={24} className="text-primary" />
            <h1 className="text-xl font-semibold">Система управления котлами</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Icon name="Bell" size={16} className="mr-2" />
              Уведомления
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Flame" size={16} className="mr-2" />
              Котлы
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="MapPin" size={16} className="mr-2" />
              Карта установок
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Calendar" size={16} className="mr-2" />
              Планировщик
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="ClipboardList" size={16} className="mr-2" />
              Задачи
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="FileText" size={16} className="mr-2" />
              Документы
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Отчеты
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Archive" size={16} className="mr-2" />
              Архив
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего котлов</CardTitle>
                  <Icon name="Flame" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allData.length}</div>
                  <p className="text-xs text-muted-foreground">+2 с прошлого месяца</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активных</CardTitle>
                  <Icon name="CheckCircle" size={16} className="text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{activeBoilers}</div>
                  <p className="text-xs text-muted-foreground">Работают штатно</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">На обслуживании</CardTitle>
                  <Icon name="Wrench" size={16} className="text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{maintenanceBoilers}</div>
                  <p className="text-xs text-muted-foreground">Плановое ТО</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Требуют внимания</CardTitle>
                  <Icon name="AlertTriangle" size={16} className="text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{warningBoilers + offlineBoilers}</div>
                  <p className="text-xs text-muted-foreground">Проблемы или отключены</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="management">Управление котлами</TabsTrigger>
                <TabsTrigger value="calendar">Календарь</TabsTrigger>
                <TabsTrigger value="map">Карта</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Общее состояние системы</CardTitle>
                      <CardDescription>Текущий статус всех установок</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Эффективность работы</span>
                          <span className="text-sm text-muted-foreground">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Активных: {activeBoilers}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">На ТО: {maintenanceBoilers}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Предупреждения: {warningBoilers}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Отключены: {offlineBoilers}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Последние события</CardTitle>
                      <CardDescription>Недавние изменения и уведомления</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Котел BLR-004 прошел ТО</p>
                            <p className="text-xs text-muted-foreground">2 часа назад</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="AlertTriangle" size={16} className="text-yellow-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Превышение температуры BLR-005</p>
                            <p className="text-xs text-muted-foreground">4 часа назад</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="Wrench" size={16} className="text-blue-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Запланировано ТО для BLR-002</p>
                            <p className="text-xs text-muted-foreground">Вчера</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="management" className="space-y-4">
                {/* Поиск и фильтры */}
                <Card>
                  <CardHeader>
                    <CardTitle>Поиск и фильтры</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="Search" size={16} className="text-muted-foreground" />
                        <Input
                          placeholder="Поиск по адресу, клиенту, ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Фильтр по статусу" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все статусы</SelectItem>
                          <SelectItem value="active">Активные</SelectItem>
                          <SelectItem value="warning">Предупреждения</SelectItem>
                          <SelectItem value="maintenance">Обслуживание</SelectItem>
                          <SelectItem value="offline">Отключены</SelectItem>
                          <SelectItem value="quotation">Комм. предложение</SelectItem>
                          <SelectItem value="production">Производство</SelectItem>
                          <SelectItem value="delivery">Доставка</SelectItem>
                          <SelectItem value="installation">Монтаж</SelectItem>
                          <SelectItem value="testing">Тестирование</SelectItem>
                          <SelectItem value="completed">Завершены</SelectItem>
                          <SelectItem value="canceled">Отменены</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Тип объекта" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все объекты</SelectItem>
                          <SelectItem value="existing">Установленные котлы</SelectItem>
                          <SelectItem value="installation">Новые установки</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setTypeFilter('all');
                          }}
                        >
                          <Icon name="X" size={16} className="mr-1" />
                          Очистить
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      Найдено: {filteredData.length} из {allData.length} объектов
                    </div>
                  </CardContent>
                </Card>
                
                {/* Основная таблица */}
                <Card>
                  <CardHeader>
                    <CardTitle>Управление котлами и установками</CardTitle>
                    <CardDescription>Полный контроль существующих котлов и новых установок</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Адрес</TableHead>
                          <TableHead>Клиент</TableHead>
                          <TableHead>Тип котла</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Прогресс</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {item.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{item.client.fullName}</div>
                                  <div className="text-xs text-muted-foreground">{item.client.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{item.boilerType}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${getStatusColor(item.status)} text-white`}>
                                {getStatusText(item.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={item.progress} className="w-16 h-2" />
                                <span className="text-sm text-muted-foreground">{item.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.type === 'existing' && item.lastService ? (
                                <div>
                                  <div className="text-xs text-muted-foreground">Посл. ТО:</div>
                                  <div className="text-sm">{item.lastService}</div>
                                  {item.temp !== undefined && (
                                    <div className="text-xs text-muted-foreground">{item.temp}°C</div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <div className="text-xs text-muted-foreground">План:</div>
                                  <div className="text-sm">{item.plannedDate}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedInstallation(item)}
                                    >
                                      <Icon name="Eye" size={14} className="mr-1" />
                                      Детали
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Детали объекта {item.id}</DialogTitle>
                                      <DialogDescription>
                                        Полная информация о клиенте, котле и документах
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {selectedInstallation && (
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Информация о клиенте */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Информация о клиенте</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                              <Avatar className="h-12 w-12">
                                                <AvatarFallback className="text-lg">
                                                  {selectedInstallation.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <h3 className="font-medium">{selectedInstallation.client.fullName}</h3>
                                                <p className="text-sm text-muted-foreground">{selectedInstallation.address}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-3">
                                              <div>
                                                <Label className="text-sm font-medium">Телефон</Label>
                                                <Input value={selectedInstallation.client.phone} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Email</Label>
                                                <Input value={selectedInstallation.client.email} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Паспорт</Label>
                                                <Input value={selectedInstallation.client.passport} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">ИНН</Label>
                                                <Input value={selectedInstallation.client.inn} readOnly />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Информация о заказе */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Детали заказа</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                              <div>
                                                <Label className="text-sm font-medium">Тип котла</Label>
                                                <Input value={selectedInstallation.boilerType} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Дата заказа</Label>
                                                <Input value={selectedInstallation.orderDate} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Планируемая дата</Label>
                                                <Input value={selectedInstallation.plannedDate} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Статус</Label>
                                                <Badge className={`${getInstallationStatusColor(selectedInstallation.status)} text-white`}>
                                                  {getInstallationStatusText(selectedInstallation.status)}
                                                </Badge>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Прогресс: {selectedInstallation.progress}%</Label>
                                                <Progress value={selectedInstallation.progress} className="mt-2" />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Документы */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Документы</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-3">
                                              {selectedInstallation.documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                  <div className="flex items-center space-x-2">
                                                    <Icon name="FileText" size={16} className="text-blue-500" />
                                                    <span className="text-sm">{doc}</span>
                                                  </div>
                                                  <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm">
                                                      <Icon name="Download" size={14} className="mr-1" />
                                                      Скачать
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                      <Icon name="Eye" size={14} className="mr-1" />
                                                      Просмотр
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                              
                                              <Button variant="outline" className="w-full">
                                                <Icon name="Plus" size={16} className="mr-2" />
                                                Добавить документ
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Фотографии */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Фотографии</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-4">
                                              <div>
                                                <h4 className="font-medium mb-2">До установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('before'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <h4 className="font-medium mb-2">Процесс установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('installation'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <h4 className="font-medium mb-2">После установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('completed'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                
                                <Button variant="outline" size="sm">
                                  <Icon name="Edit" size={14} className="mr-1" />
                                  Изменить
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Календарь установок</CardTitle>
                      <CardDescription>Планирование новых установок котлов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Запланированные работы</CardTitle>
                      <CardDescription>Ближайшие установки и обслуживание</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="Calendar" size={16} className="text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Установка котла</p>
                            <p className="text-xs text-muted-foreground">ул. Новая, 25 • 25 сентября</p>
                          </div>
                          <Badge>Запланировано</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="Wrench" size={16} className="text-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">ТО котла BLR-001</p>
                            <p className="text-xs text-muted-foreground">ул. Ленина, 15 • 28 сентября</p>
                          </div>
                          <Badge variant="secondary">Обслуживание</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="AlertCircle" size={16} className="text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Проверка BLR-005</p>
                            <p className="text-xs text-muted-foreground">ул. Советская, 12 • 30 сентября</p>
                          </div>
                          <Badge variant="outline">Срочно</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Карта установок котлов</CardTitle>
                    <CardDescription>Географическое расположение всех котлов в системе</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-muted rounded-lg p-8 h-96 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Icon name="Map" size={48} className="text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">Интерактивная карта</h3>
                          <p className="text-sm text-muted-foreground">
                            Здесь будет отображаться карта с метками всех установленных котлов
                          </p>
                        </div>
                        <Button className="mt-4">
                          <Icon name="MapPin" size={16} className="mr-2" />
                          Показать все установки
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}