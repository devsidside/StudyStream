import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { QueryErrorBoundary } from "@/components/error-boundaries";
import NoteCard from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function NotesHub() {
  const { data: trendingNotes } = useQuery({
    queryKey: ['/api/analytics/trending'],
  });

  const { data: topNotes } = useQuery({
    queryKey: ['/api/analytics/top-notes'],
  });

  const { data: recentNotes } = useQuery({
    queryKey: ['/api/analytics/recent'],
  });

  const { data: subjectStats } = useQuery({
    queryKey: ['/api/analytics/subjects'],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <QueryErrorBoundary queryKeys={['/api/analytics/trending', '/api/analytics/top-notes', '/api/analytics/recent', '/api/analytics/subjects']}>
        {/* Header */}
      <section className="pt-24 pb-12 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Notes & <span className="gradient-text">Projects Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access thousands of study materials, share your knowledge, and collaborate with peers across universities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground" data-testid="button-browse-all">
                  Browse All Content
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="lg" data-testid="button-upload-notes">
                  Upload Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card data-testid="card-categories">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <span>BY SUBJECT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {subjectStats?.map((subject: any) => (
                    <Link key={subject.subject} href={`/browse?subject=${subject.subject}`}>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" data-testid={`link-subject-${subject.subject}`}>
                        <span className="capitalize text-sm">{subject.subject.replace('-', ' ')}</span>
                        <span className="text-xs text-muted-foreground">({subject.count})</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Content Types */}
              <Card data-testid="card-content-types">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>BY TYPE</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { key: 'lecture-notes', label: 'Lecture Notes', count: 567 },
                    { key: 'study-guide', label: 'Study Guides', count: 234 },
                    { key: 'past-paper', label: 'Past Papers', count: 189 },
                    { key: 'project', label: 'Projects', count: 156 },
                    { key: 'lab-report', label: 'Lab Reports', count: 123 },
                    { key: 'assignment', label: 'Assignments', count: 234 },
                  ].map((type) => (
                    <Link key={type.key} href={`/browse?contentType=${type.key}`}>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" data-testid={`link-content-type-${type.key}`}>
                        <span className="text-sm">{type.label}</span>
                        <span className="text-xs text-muted-foreground">({type.count})</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/upload">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-upload-notes-sidebar">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      Upload Notes
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-create-project">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    Create Project
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-find-study-group">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Find Study Group
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="featured" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3" data-testid="tabs-content">
                  <TabsTrigger value="featured" data-testid="tab-featured">Featured</TabsTrigger>
                  <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
                  <TabsTrigger value="recent" data-testid="tab-recent">Recent</TabsTrigger>
                </TabsList>

                <TabsContent value="featured" className="space-y-6">
                  {/* Trending This Week */}
                  <Card data-testid="card-trending-week">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                        </svg>
                        <span>TRENDING THIS WEEK</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trendingNotes?.slice(0, 1).map((note: any) => (
                        <NoteCard key={note.id} note={note} featured />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Project Spotlight */}
                  <Card data-testid="card-project-spotlight">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <span>PROJECT SPOTLIGHT</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topNotes?.filter((note: any) => note.contentType === 'project').slice(0, 1).map((note: any) => (
                        <NoteCard key={note.id} note={note} featured />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recent Uploads */}
                  <Card data-testid="card-recent-uploads">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        <span>RECENT UPLOADS</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentNotes?.slice(0, 5).map((note: any) => (
                        <div key={note.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/notes/${note.id}`}>
                              <p className="font-medium text-sm truncate hover:text-primary transition-colors" data-testid={`link-note-${note.id}`}>
                                {note.title}
                              </p>
                            </Link>
                            <p className="text-xs text-muted-foreground capitalize">
                              {note.subject?.replace('-', ' ')} • {note.contentType?.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link href="/browse?sortBy=recent">
                        <Button variant="ghost" size="sm" className="w-full" data-testid="button-view-all-recent">
                          View All →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trending" className="space-y-4">
                  {trendingNotes?.map((note: any) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </TabsContent>

                <TabsContent value="recent" className="space-y-4">
                  {recentNotes?.map((note: any) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </QueryErrorBoundary>
    </div>
  );
}
