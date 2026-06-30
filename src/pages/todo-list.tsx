import Layout from '@theme/Layout';
import React from 'react';
import styles from './todo-list.module.css';

interface TodoItem {
  title: string;
  description: string;
  tag: string;
  status: 'planning' | 'active' | 'later';
}

interface TodoColumn {
  title: string;
  items: TodoItem[];
}

const statusLabels: Record<TodoItem['status'], string> = {
  planning: '计划中',
  active: '进行中',
  later: '后续',
};

const columns: TodoColumn[] = [
  {
    title: '服务器',
    items: [
      {
        title: '公共工程整理',
        description: '集中记录地标修整、公共设施和玩家提出的建设方向，方便大家认领与跟进。',
        tag: '建设',
        status: 'active',
      },
      {
        title: '公共区域说明补充',
        description: '为常用设施、交通节点和公共仓库补齐位置、用途和维护人信息。',
        tag: '文档',
        status: 'planning',
      },
    ],
  },
  {
    title: '网页',
    items: [
      {
        title: '画廊内容更新',
        description: '继续筛选有代表性的服务器风景与工程图片，让首页与画廊保持准确。',
        tag: '画廊',
        status: 'planning',
      },
      {
        title: '常用入口校对',
        description: '定期检查下载、成员、统计、地图和计划入口，保证导航可达。',
        tag: '首页',
        status: 'active',
      },
    ],
  },
  {
    title: '客户端',
    items: [
      {
        title: '客户端整合包维护',
        description: '确认整合包内容与服务器版本匹配后，更新下载文件。',
        tag: '下载',
        status: 'later',
      },
      {
        title: '客户端说明补充',
        description: '记录游戏版本、推荐启动器、账号登录和首次进入服务器的准备事项。',
        tag: '说明',
        status: 'planning',
      },
    ],
  },
];

const taskCount = columns.reduce((count, column) => count + column.items.length, 0);

export default function TodoListPage(): JSX.Element {
  return (
    <Layout title="近期计划" description="Lie-downCraft 服务器近期计划">
      <main className={styles.todoPage}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <div>
              <h1>近期计划</h1>
              <p>公开整理服务器建设、网页内容和客户端维护的近期方向。</p>
            </div>
            <div className={styles.summary} aria-label="待办统计">
              <span>计划事项</span>
              <strong>{taskCount}</strong>
            </div>
          </section>

          <section className={styles.board} aria-label="近期计划列表">
            {columns.map(column => (
              <article className={styles.column} key={column.title}>
                <div className={styles.columnHeader}>
                  <h2>{column.title}</h2>
                  <span className={styles.count}>{column.items.length}</span>
                </div>
                <div className={styles.taskList}>
                  {column.items.map(item => (
                    <div className={styles.taskCard} key={item.title}>
                      <div className={styles.meta}>
                        <span className={styles.tag}>{item.tag}</span>
                        <span className={`${styles.status} ${styles[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
