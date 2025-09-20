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
import Icon from "@/components/ui/icon";
import { useState } from "react";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);

  const boilerData = [
    { id: "BLR-001", address: "ул. Ленина, 15", status: "active", temp: 72, lastService: "2024-08-15" },
    { id: "BLR-002", address: "пр. Победы, 32", status: "maintenance", temp: 45, lastService: "2024-09-01" },
    { id: "BLR-003", address: "ул. Гагарина, 8", status: "offline", temp: 0, lastService: "2024-07-20" },
    { id: "BLR-004", address: "ул. Мира, 45", status: "active", temp: 68, lastService: "2024-08-28" },
    { id: "BLR-005", address: "ул. Советская, 12", status: "warning", temp: 85, lastService: "2024-09-10" }
  ];

  const installationData = [
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
      status: "production",
      orderDate: "2024-09-15",
      plannedDate: "2024-09-25",
      boilerType: "Котел газовый 24кВт",
      progress: 20,
      documents: ["contract.pdf", "technical_spec.pdf"],
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
      status: "delivery",
      orderDate: "2024-09-10",
      plannedDate: "2024-09-22",
      boilerType: "Котел конденсационный 28кВт",
      progress: 60,
      documents: ["contract.pdf", "passport_copy.pdf"],
      photos: ["site_before_1.jpg"]
    },
    {
      id: "INS-003",
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
      documents: ["contract.pdf", "installation_permit.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "installation_2.jpg"]
    },
    {
      id: "INS-004",
      address: "ул. Садовая, 45",
      client: {
        fullName: "Козлова Анна Дмитриевна",
        phone: "+7 (999) 456-78-90", 
        email: "kozlova@example.com",
        passport: "4567 890123",
        inn: "456789012345"
      },
      status: "completed",
      orderDate: "2024-08-20",
      plannedDate: "2024-09-15",
      boilerType: "Котел комбинированный 32кВт",
      progress: 100,
      documents: ["contract.pdf", "completion_act.pdf", "warranty.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "completed_1.jpg", "completed_2.jpg"]
    }
  ];

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

  const getInstallationStatusColor = (status: string) => {
    switch (status) {
      case "production": return "bg-orange-500";
      case "delivery": return "bg-blue-500";
      case "installation": return "bg-purple-500";
      case "testing": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getInstallationStatusText = (status: string) => {
    switch (status) {
      case "production": return "Производство";
      case "delivery": return "Доставка";
      case "installation": return "Монтаж";
      case "testing": return "Тестирование";
      case "completed": return "Завершен";
      default: return "Неизвестно";
    }
  };

  const activeBoilers = boilerData.filter(b => b.status === "active").length;
  const maintenanceBoilers = boilerData.filter(b => b.status === "maintenance").length;
  const warningBoilers = boilerData.filter(b => b.status === "warning").length;
  const offlineBoilers = boilerData.filter(b => b.status === "offline").length;

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
                  <div className="text-2xl font-bold">{boilerData.length}</div>
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
                <TabsTrigger value="boilers">Список котлов</TabsTrigger>
                <TabsTrigger value="installations">Монтажи</TabsTrigger>
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

              <TabsContent value="boilers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Управление котлами</CardTitle>
                    <CardDescription>Мониторинг состояния и управление оборудованием</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Адрес установки</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Температура</TableHead>
                          <TableHead>Последнее ТО</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {boilerData.map((boiler) => (
                          <TableRow key={boiler.id}>
                            <TableCell className="font-medium">{boiler.id}</TableCell>
                            <TableCell>{boiler.address}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${getStatusColor(boiler.status)} text-white`}>
                                {getStatusText(boiler.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>{boiler.temp}°C</TableCell>
                            <TableCell>{boiler.lastService}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Icon name="Eye" size={14} className="mr-1" />
                                  Детали
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Icon name="Settings" size={14} className="mr-1" />
                                  Настройки
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

              <TabsContent value="installations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Управление монтажами</CardTitle>
                    <CardDescription>Контроль этапов установки котлов и работа с клиентами</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Адрес</TableHead>
                          <TableHead>Клиент</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Прогресс</TableHead>
                          <TableHead>Дата план.</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {installationData.map((installation) => (
                          <TableRow key={installation.id}>
                            <TableCell className="font-medium">{installation.id}</TableCell>
                            <TableCell>{installation.address}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {installation.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{installation.client.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${getInstallationStatusColor(installation.status)} text-white`}>
                                {getInstallationStatusText(installation.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={installation.progress} className="w-16 h-2" />
                                <span className="text-sm text-muted-foreground">{installation.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{installation.plannedDate}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedInstallation(installation)}
                                    >
                                      <Icon name="Eye" size={14} className="mr-1" />
                                      Детали
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Детали установки {installation.id}</DialogTitle>
                                      <DialogDescription>
                                        Полная информация о клиенте, прогрессе установки и документах
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